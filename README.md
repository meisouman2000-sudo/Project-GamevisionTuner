# 🎮 GameVision Tuner

**NVIDIA ディスプレイ最適化ツール — ゲームごとに画質を自動調整**

![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📖 概要

GameVision Tuner は、NVIDIA GPU を搭載した Windows PC 向けのデスクトップアプリです。  
**ゲームごとにディスプレイ設定（明るさ・コントラスト・ガンマ・デジタルバイブランス）のプロファイルを保存し、ゲーム起動時に自動適用、終了時に自動復元します。**

FPS やバトルロイヤルなどの「視認性」が重要なゲームで、手動で NVIDIA コントロールパネルを操作する手間をなくすために開発しました。

---

## ✨ 主な機能

| 機能 | 説明 |
|------|------|
| 🎛️ **ゲーム別プロファイル** | 明るさ・コントラスト・ガンマ・デジタルバイブランスを個別に設定 |
| 🔄 **自動適用・自動復元** | ゲーム起動を検知して自動で設定を切り替え、終了時に元に戻す |
| 📸 **設定スナップショット** | 起動時にデスクトップの現在設定を記憶し、復元時にはユーザーの元の設定を忠実に再現 |
| 🎮 **Steam ライブラリ連携** | インストール済み Steam ゲームを自動スキャンし、ホワイトリスト方式で管理 |
| 🚀 **ワンクリック起動** | アプリ内から直接ゲームを起動（設定適用→起動を一括処理） |
| 🖥️ **Windows 自動起動** | PC 起動時にバックグラウンドで自動起動し、常に監視を継続 |
| 🛡️ **安全終了** | アプリを閉じた際もゲーム用設定を残さず確実に復元 |

---

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────┐
│           Electron Main Process         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ IPC Handler │  │  Game Monitor    │  │
│  │ (設定管理)   │  │ (Registry監視)   │  │
│  └──────┬──────┘  └───────┬──────────┘  │
│         │                 │              │
│         │    ┌────────────┴────────┐     │
│         │    │  DisplayTuner.exe   │     │
│         │    │  (C# / NVAPI)       │     │
│         │    └─────────────────────┘     │
├─────────┼───────────────────────────────┤
│         ▼                                │
│  ┌─────────────────────────────────┐     │
│  │      React Renderer (UI)       │     │
│  │  TailwindCSS + Framer Motion   │     │
│  └─────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### 技術スタック

- **フロントエンド**: React 18 + TypeScript + TailwindCSS + Framer Motion
- **バックエンド**: Electron (Node.js) + electron-store (永続化)
- **ディスプレイ制御**: C# ネイティブバイナリ (`DisplayTuner.exe`) — NVAPI + GDI 直接呼び出し
- **ゲーム検知**: Windows レジストリ (`HKCU\Software\Valve\Steam\RunningAppID`) ポーリング
- **ビルド**: Vite + electron-builder (NSIS インストーラー)

---

## 🚀 セットアップ

### 必要条件

- Node.js 18 以上
- NVIDIA GPU + ドライバー
- Windows 10/11
- .NET Framework 4.x（DisplayTuner.exe のコンパイル用）

### インストール・開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# C# バックエンドのコンパイル（初回のみ）
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe -out:backend\DisplayTuner.exe backend\DisplayTuner.cs

# 本番ビルド（インストーラー生成）
npm run build
```

---

## 📁 プロジェクト構成

```
├── backend/
│   └── DisplayTuner.cs        # C# ネイティブ NVAPI/GDI 制御
├── electron/
│   ├── main.ts                # Electron メインプロセス
│   ├── preload.ts             # IPC ブリッジ
│   └── steam.ts               # Steam ライブラリスキャン
├── src/
│   ├── App.tsx                # メイン UI（ゲームリスト管理）
│   ├── components/
│   │   ├── GameCard.tsx       # ゲームカードコンポーネント
│   │   ├── SettingsModal.tsx  # プロファイル編集モーダル
│   │   └── TitleBar.tsx       # カスタムタイトルバー
│   ├── index.css              # TailwindCSS + カスタムスタイル
│   └── vite-env.d.ts          # TypeScript 型定義
├── build/
│   └── icon.png               # アプリアイコン
├── electron-builder.json5     # ビルド設定
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎯 開発の意図・設計思想

### なぜ作ったのか

FPS ゲーム（Apex Legends, Valorant 等）では**デジタルバイブランスを上げると敵の視認性が向上**します。しかし、ゲームを終了するたびに手動で NVIDIA コントロールパネルから元に戻すのは面倒です。

このアプリは「**ゲームを開いたら自動で画質を変え、閉じたら元に戻す**」という一連の流れを完全に自動化します。

### 設計上の重要な判断

1. **ホワイトリスト方式のゲーム管理**  
   ブラックリスト（非表示にするゲームを選ぶ）ではなく、ホワイトリスト（管理するゲームを選ぶ）を採用。ユーザーが明示的に選んだゲームだけを管理対象にすることで、意図しない設定変更を防止。

2. **設定スナップショット方式の復元**  
   ハードコードされた「デフォルト値」に戻すのではなく、アプリ起動時にその時点の実際の設定を読み取って記憶。ゲーム終了時にはユーザーが普段使っている設定に忠実に復元。

3. **C# ネイティブバイナリによるディスプレイ制御**  
   Node.js から直接 NVAPI を呼ぶのではなく、C# の小さな CLI ツール (`DisplayTuner.exe`) を経由。NVAPI の P/Invoke が最も安定する環境を活用。

4. **低負荷なバックグラウンド監視**  
   `cmd.exe` のシェルを経由せず `reg.exe` を直接呼び出し、2秒間隔でポーリング。タスクマネージャーへの影響を最小化。

5. **安全終了の保証**  
   ゲームプレイ中にアプリを閉じても、`before-quit` イベントで確実に設定を復元してから終了。

---

## 📄 ライセンス

MIT License — 自由にご利用ください。
