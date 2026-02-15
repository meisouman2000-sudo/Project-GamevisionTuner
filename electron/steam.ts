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
    return Array.from(gamesMap.values())
        .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
}
