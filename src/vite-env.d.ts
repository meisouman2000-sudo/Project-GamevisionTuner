/// <reference types="vite/client" />

interface Profile {
    name: string;
    brightness: number;
    contrast: number;
    gamma: number;
    digitalVibrance: number; // 0-100
}

interface Game {
    id: string; // AppID
    title: string;
    installDir: string;
    lastPlayed?: number;
    executable?: string;
}

interface Window {
    gameVisionAPI: {
        scanSteamLibrary: () => Promise<Game[]>;
        saveProfile: (gameId: string, profile: Profile) => Promise<boolean>;
        loadProfile: (gameId: string) => Promise<Profile | null>;
        applySettings: (profile: Profile) => Promise<void>;
        launchGame: (gameId: string, installDir?: string) => Promise<{ success: boolean; error?: string }>;
        restoreDefaultSettings: () => Promise<void>;
        minimizeWindow: () => Promise<void>;
        maximizeWindow: () => Promise<void>;
        closeWindow: () => Promise<void>;
        getActiveGames: () => Promise<string[] | null>;
        updateActiveGames: (gameIds: string[]) => Promise<boolean>;
    }
}
