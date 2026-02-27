import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Winreg = require('winreg');
const vdf = require('vdf');

export interface Game {
    id: string;
    title: string;
    installDir: string;
    lastPlayed?: number;
    executable?: string;
    headerImageUrl?: string; // From Steam Store API (new hash-based URL format)
}

export async function getSteamPath(): Promise<string> {
    return new Promise((resolve) => {
        const regKey = new Winreg({
            hive: Winreg.HKCU,
            key: '\\Software\\Valve\\Steam'
        });

        regKey.get('SteamPath', (err: any, item: any) => {
            if (err || !item) {
                // Fallback
                const defaultPath = 'C:\\Program Files (x86)\\Steam';
                resolve(fs.existsSync(defaultPath) ? defaultPath : '');
            } else {
                resolve(item.value);
            }
        });
    });
}

export async function scanSteamGames(): Promise<Game[]> {
    let steamPath = await getSteamPath();
    if (!steamPath) return [];

    // Normalize path (Windows registry might use / or \)
    steamPath = path.resolve(steamPath);

    const libraries: string[] = [steamPath];

    // Read libraryfolders.vdf
    const vdfPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
    if (fs.existsSync(vdfPath)) {
        try {
            const content = fs.readFileSync(vdfPath, 'utf-8');
            const data = vdf.parse(content);

            // The file usually starts with "libraryfolders"
            const root = data.libraryfolders || data;

            for (const key in root) {
                if (typeof root[key] === 'object' && root[key].path) {
                    libraries.push(root[key].path);
                }
            }
        } catch (e) {
            console.error("Failed to parse libraryfolders.vdf", e);
        }
    }

    const uniqueLibraries = [...new Set(libraries)];
    const gamesMap = new Map<string, Game>();

    for (const lib of uniqueLibraries) {
        const steamAppsPath = path.join(lib, 'steamapps');
        if (!fs.existsSync(steamAppsPath)) continue;

        try {
            const files = fs.readdirSync(steamAppsPath);
            for (const file of files) {
                if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
                    try {
                        const manifestContent = fs.readFileSync(path.join(steamAppsPath, file), 'utf-8');
                        const manifestData = vdf.parse(manifestContent);
                        const appState = manifestData.AppState || manifestData;

                        if (appState && appState.appid && appState.name) {
                            const name = appState.name.toLowerCase();
                            // Filter out common non-games
                            if (name.includes('server') ||
                                name.includes('tool') ||
                                name.includes('redist') ||
                                name.includes('sdk') ||
                                name.includes('driver')) {
                                continue;
                            }

                            if (!gamesMap.has(appState.appid)) {
                                gamesMap.set(appState.appid, {
                                    id: appState.appid,
                                    title: appState.name,
                                    installDir: path.join(steamAppsPath, 'common', appState.installdir),
                                    lastPlayed: parseInt(appState.LastPlayed || '0', 10)
                                });
                            }
                        }
                    } catch (e) {
                        console.error(`Failed to parse ${file}`, e);
                    }
                }
            }
        } catch (e) {
            console.error(`Failed to read directory ${steamAppsPath}`, e);
        }
    }

    // Sort by LastPlayed descending
    const games = Array.from(gamesMap.values())
        .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));

    // Fetch header image URLs from Steam Store API
    try {
        await fetchHeaderImages(games);
    } catch (e) {
        console.error('[Steam] Failed to fetch header images:', e);
    }

    return games;
}

// Cache for header image URLs to avoid redundant API calls
const headerImageCache = new Map<string, string>();

/** Fetch header image URLs from Steam Store API */
async function fetchHeaderImages(games: Game[]): Promise<void> {
    // Only fetch for games we haven't cached yet
    const uncachedGames = games.filter(g => !headerImageCache.has(g.id));
    if (uncachedGames.length === 0) {
        // Apply cached URLs
        games.forEach(g => {
            if (headerImageCache.has(g.id)) {
                g.headerImageUrl = headerImageCache.get(g.id);
            }
        });
        return;
    }

    // Batch API calls (Steam API supports multiple appids comma-separated)
    const batchSize = 5;
    for (let i = 0; i < uncachedGames.length; i += batchSize) {
        const batch = uncachedGames.slice(i, i + batchSize);

        await Promise.all(batch.map(async (game) => {
            try {
                const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${game.id}&filters=basic`);
                if (!res.ok) return;

                const data = await res.json();
                const appData = data[game.id];

                if (appData?.success && appData.data?.header_image) {
                    const url = appData.data.header_image;
                    headerImageCache.set(game.id, url);
                    game.headerImageUrl = url;
                    console.log(`[Steam] Got header image for ${game.title}: ${url.substring(0, 80)}...`);
                }
            } catch {
                // Silently skip failed API calls
            }
        }));

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < uncachedGames.length) {
            await new Promise(r => setTimeout(r, 500));
        }
    }

    // Apply all cached URLs
    games.forEach(g => {
        if (headerImageCache.has(g.id)) {
            g.headerImageUrl = headerImageCache.get(g.id);
        }
    });
}
