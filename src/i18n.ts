export type Language = 'en' | 'ja';

const translations = {
    en: {
        resetToDefault: 'RESET TO DEFAULT',
        library: 'LIBRARY',
        scanning: 'SCANNING MAINFRAME...',
        addGame: 'Add Game',
        addGameToLibrary: 'Add Game to Library',
        searchLibrary: 'Search your library...',
        noGamesFound: 'No matching games found.',
        lastPlayed: 'Last Played',
        never: 'Never',
        add: 'ADD',
        added: '(Added)',
        close: 'Close',
        cancel: 'Cancel',
        saveProfile: 'Save Profile',
        preview: 'Preview',
        realtime: 'Realtime',
        brightness: 'Brightness',
        contrast: 'Contrast',
        gamma: 'Gamma',
        digitalVibrance: 'Digital Vibrance',
        go: 'GO!',
        running: 'Running...',
        removeGame: 'Remove Game',
        settingsRestored: 'Display settings restored to default.',
        launchFailed: 'Failed to launch game. Check console for details.',
    },
    ja: {
        resetToDefault: '\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3059',
        library: '\u30E9\u30A4\u30D6\u30E9\u30EA',
        scanning: '\u30B9\u30AD\u30E3\u30F3\u4E2D...',
        addGame: '\u30B2\u30FC\u30E0\u3092\u8FFD\u52A0',
        addGameToLibrary: '\u30E9\u30A4\u30D6\u30E9\u30EA\u306B\u30B2\u30FC\u30E0\u3092\u8FFD\u52A0',
        searchLibrary: '\u30E9\u30A4\u30D6\u30E9\u30EA\u3092\u691C\u7D22...',
        noGamesFound: '\u4E00\u81F4\u3059\u308B\u30B2\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093',
        lastPlayed: '\u6700\u7D42\u30D7\u30EC\u30A4',
        never: '\u672A\u30D7\u30EC\u30A4',
        add: '\u8FFD\u52A0',
        added: '(\u8FFD\u52A0\u6E08\u307F)',
        close: '\u9589\u3058\u308B',
        cancel: '\u30AD\u30E3\u30F3\u30BB\u30EB',
        saveProfile: '\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u4FDD\u5B58',
        preview: '\u30D7\u30EC\u30D3\u30E5\u30FC',
        realtime: '\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0',
        brightness: '\u8F1D\u5EA6',
        contrast: '\u30B3\u30F3\u30C8\u30E9\u30B9\u30C8',
        gamma: '\u30AC\u30F3\u30DE',
        digitalVibrance: '\u30C7\u30B8\u30BF\u30EB\u30D0\u30A4\u30D6\u30E9\u30F3\u30B9',
        go: 'GO!',
        running: '\u8D77\u52D5\u4E2D...',
        removeGame: '\u30B2\u30FC\u30E0\u3092\u524A\u9664',
        settingsRestored: '\u30C7\u30A3\u30B9\u30D7\u30EC\u30A4\u8A2D\u5B9A\u3092\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3057\u307E\u3057\u305F',
        launchFailed: '\u30B2\u30FC\u30E0\u306E\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
    return translations[lang][key];
}

export default translations;
