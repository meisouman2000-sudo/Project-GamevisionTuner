/// <reference types="vite/client" />

interface Profile {
    name: string;
    brightness: number;
    contrast: number;
    gamma: number;
    digitalVibrance: number;
}

interface Game {
    id: string;
    title: string;
    installDir: string;
    lastPlayed?: number;
    executable?: string;
}

interface AuthUser {
    id: string;
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
}

interface SubscriptionInfo {
    plan: 'free' | 'pro';
    status: string;
    currentPeriodEnd: string | null;
}

interface AuthState {
    loggedIn: boolean;
    user: AuthUser | null;
    subscription: SubscriptionInfo;
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
        // Auth + Subscription
        getAuthState: () => Promise<AuthState>;
        getGameLimit: (plan: string) => Promise<number>;
        signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
        signOut: () => Promise<boolean>;
        createCheckoutSession: (interval: string) => Promise<{ url: string | null; error?: string }>;
        createPortalSession: () => Promise<{ url: string | null; error?: string }>;
        openExternalUrl: (url: string) => Promise<boolean>;
    }
}
