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

        // Onboarding
        ob_title1: 'Welcome to GameVision Tuner',
        ob_desc1: 'Configure NVIDIA Control Panel display settings (brightness, contrast, digital vibrance) individually for each game. These custom settings are automatically applied when you play.',
        ob_title2: 'Set Up Profiles',
        ob_desc2: 'Click the settings icon on any game to adjust its display settings. Preview changes in real-time.',
        ob_title3: 'Play and Enjoy',
        ob_desc3: 'Launch games directly from the app. Your custom settings will be applied automatically while the game is running.',
        ob_title4: 'Keep It Running',
        ob_desc4: 'GameVision Tuner runs in the background. Close the window to minimize it to the system tray.',
        ob_back: 'Back',
        ob_next: 'Next',
        ob_start: 'Get Started',

        // Settings Modal Onboarding
        sm_ob_title: 'Slider Guide',
        sm_ob_brightness: 'Brightness — Adjusts overall screen brightness via NVIDIA settings.',
        sm_ob_contrast: 'Contrast — Controls the difference between light and dark areas.',
        sm_ob_gamma: 'Gamma — Fine-tunes mid-tone brightness. Higher = brighter shadows.',
        sm_ob_vibrance: 'Digital Vibrance — Boosts color saturation for vivid visuals.',
        sm_ob_footer: 'Save your profile and it will auto-apply every time you launch this game.',
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

        // Onboarding
        ob_title1: 'GameVision Tunerへようこそ',
        ob_desc1: 'NVIDIAコントロールパネルの画面設定（輝度、コントラスト、デジタルバイブランスなど）をゲームごとに個別で設定できます。プレイ時にこれらのカスタム設定が自動的に適用されます。',
        ob_title2: 'プロファイルの設定',
        ob_desc2: 'ゲームの設定アイコンから表示を調整します。変更はリアルタイムでプレビューできます。',
        ob_title3: 'ゲームの起動',
        ob_desc3: 'アプリから直接ゲームを起動。実行中はカスタム設定が自動的に適用され、終了すると元に戻ります。',
        ob_title4: 'バックグラウンドで準備完了',
        ob_desc4: 'このアプリはバックグラウンド動作に特化しています。ウィンドウを閉じるとタスクトレイに最小化され、自動適用の準備が整います。',
        ob_back: '戻る',
        ob_next: '次へ',
        ob_start: 'はじめる',

        // Settings Modal Onboarding
        sm_ob_title: 'スライダーガイド',
        sm_ob_brightness: '輝度 — NVIDIA設定で画面全体の明るさを調整します。',
        sm_ob_contrast: 'コントラスト — 明るい部分と暗い部分の差を調整します。',
        sm_ob_gamma: 'ガンマ — 中間軾の明るさを微調整。高いほど暗い部分が明るくなります。',
        sm_ob_vibrance: 'デジタルバイブランス — 色彩の鮮やかさを強調します。',
        sm_ob_footer: 'プロファイルを保存すると、次回からゲーム起動時に自動で適用されます。',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
    return translations[lang][key];
}

export default translations;
