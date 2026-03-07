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

interface SubscriptionStatus {
    active: boolean;
    licenseKey: string | null;
    plan: 'free' | 'pro';
    expiresAt: string | null;
    lastValidated: string | null;
}

interface Window {
    gameVisionAPI: {
        scanSteamLibrary: () => Promise<Game[]>;
        saveProfile: (gameId: string, profile: Profile) => Promise<boolean>;
        loadProfile: (gameId: string) => Promise<Profile | null>;
        getSavedProfileIds: (gameIds: string[]) => Promise<string[]>;
        applySettings: (profile: Profile) => Promise<void>;
        launchGame: (gameId: string, installDir?: string) => Promise<{ success: boolean; error?: string }>;
        clearGameProfile: (gameId: string) => Promise<boolean>;
        restoreDisplayToDefault: () => Promise<boolean>;
        minimizeWindow: () => Promise<void>;
        maximizeWindow: () => Promise<void>;
        closeWindow: () => Promise<void>;
        getActiveGames: () => Promise<string[] | null>;
        updateActiveGames: (gameIds: string[]) => Promise<boolean>;
        onSteamLibraryUpdated: (callback: (games: Game[]) => void) => (() => void);
        getLanguage: () => Promise<string>;
        setLanguage: (lang: string) => Promise<boolean>;
        getSubscriptionStatus: () => Promise<SubscriptionStatus>;
        getGameLimit: () => Promise<number>;
        activateLicense: (licenseKey: string) => Promise<{ success: boolean; error?: string }>;
        deactivateLicense: () => Promise<boolean>;
    }
}
