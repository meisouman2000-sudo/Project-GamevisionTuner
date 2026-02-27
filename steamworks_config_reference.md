# Steamworks ダッシュボード設定リファレンス

> Steamworks パートナーサイトで入力する項目を、そのまま転記できるようまとめたものです。

---

## 1. 基本情報

| 項目 | 入力値 |
|------|--------|
| **アプリ種別** | Software（ゲームではなくソフトウェア） |
| **アプリ名** | GameVision Tuner |
| **App ID** | （Steamworks登録後に自動発行） |
| **開発者名** | （ご自身の名前 or チーム名） |
| **パブリッシャー名** | （同上） |
| **リリース日** | （任意の日付） |
| **価格** | 無料 or 有料（ご判断ください） |

---

## 2. 対応プラットフォーム

| プラットフォーム | 対応 | 備考 |
|-----------------|------|------|
| **Windows** | ✅ 対応 | 64bit のみ |
| **macOS** | ❌ 非対応 | NVAPI が Windows 専用のため |
| **Linux / SteamOS** | ❌ 非対応 | 同上 |

> ⚠️ Steamworksダッシュボードの「プラットフォーム」設定で **Windows のみにチェック** してください。

---

## 3. システム要件（Steamストアページに表示される内容）

### 最小要件

| 項目 | 値 |
|------|-----|
| **OS** | Windows 10（64bit） |
| **プロセッサ** | 1 GHz 以上（特に制限なし） |
| **メモリ** | 4 GB RAM |
| **グラフィック** | NVIDIA GeForce シリーズ（**必須**） |
| **DirectX** | Version 11 |
| **ストレージ** | 200 MB の空き容量 |
| **追加事項** | Steam クライアントがインストール済みであること |

### 推奨要件

| 項目 | 値 |
|------|-----|
| **OS** | Windows 11（64bit） |
| **プロセッサ** | 2 GHz 以上 |
| **メモリ** | 8 GB RAM |
| **グラフィック** | NVIDIA GeForce GTX 1060 以上 |
| **DirectX** | Version 11 |
| **ストレージ** | 200 MB の空き容量 |

### 注意書き（追加メモ欄に記載推奨）

```
本ソフトウェアは NVIDIA GPU 専用です。AMD / Intel GPU では動作しません。
NVIDIA ドライバーが最新の状態であることを推奨します。
```

---

## 4. カテゴリ・ジャンル・タグ

### カテゴリ（Steamworksダッシュボード > ストア設定 > カテゴリ）

| カテゴリ | 選択 |
|---------|------|
| Single-player | ※ ソフトウェアでは通常不要 |
| Multi-player | ❌ |
| Steam Cloud | ❌（将来的に対応可能） |
| Stats and Achievements | ❌ |

### ジャンル

| 選択肢 | 選択 |
|--------|------|
| **Utilities** | ✅ |
| Game Development | ❌ |
| Audio Production | ❌ |
| Video Production | ❌ |

### タグ（ユーザー向け検索用 — 最大20個）

以下から選択・追加：

1. Utilities
2. Gaming
3. Customization
4. NVIDIA
5. Display
6. FPS
7. Automation
8. Color Calibration
9. Game Tools
10. Hardware

---

## 5. コンテンツレーティング

| 項目 | 値 |
|------|-----|
| **成人向けコンテンツ** | なし |
| **暴力表現** | なし |
| **ヌードや性的なコンテンツ** | なし |
| **レーティング** | 全年齢向け |

> ユーティリティソフトウェアのため、レーティングの問題はありません。

---

## 6. 対応言語

| 言語 | インターフェース | 音声 | 字幕 |
|------|----------------|------|------|
| **日本語** | ✅ | ❌ | ❌ |
| **English** | ❌（将来対応可能） | ❌ | ❌ |

---

## 7. Launch Options（起動設定）

Steamworksダッシュボード > Installation > General > Launch Options で以下を設定：

| 項目 | 値 |
|------|-----|
| **実行ファイル** | `GameVision Tuner.exe` |
| **起動引数** | （なし） |
| **プラットフォーム** | Windows |
| **アーキテクチャ** | 64bit |
| **起動タイプ** | Launch（通常起動） |

---

## 8. Depots（デポ設定）

| 項目 | 値 |
|------|-----|
| **デポ名** | GameVision Tuner Content |
| **OS** | Windows |
| **アーキテクチャ** | 64bit |
| **含めるファイル** | `win-unpacked/` フォルダの全内容 |

### ビルドに含まれるファイル構成（参考）

```
win-unpacked/
├── GameVision Tuner.exe          ← メイン実行ファイル
├── resources/
│   ├── app.asar                   ← アプリ本体（パッケージ済み）
│   └── backend/
│       └── DisplayTuner.exe       ← NVAPI制御バイナリ
├── *.dll                          ← Electron ランタイム
└── ...
```

---

## 9. Steamworks SDK 統合（任意）

| 機能 | 現状 | 将来的に |
|------|------|---------|
| **Steam Overlay** | ❌（未統合） | 不要 |
| **Steam Cloud** | ❌ | プロファイル保存の同期で活用可能 |
| **Achievements** | ❌ | 不要 |
| **Workshop** | ❌ | プリセット共有で活用可能 |
| **Rich Presence** | ❌ | 「○○のプロファイルを適用中」表示に使える |

> 現時点ではSteamworks SDK の統合は不要です。ソフトウェアとして配布するだけなら、ビルドをアップロードするだけでOKです。

---

## 10. 法的情報

| 項目 | 対応 |
|------|------|
| **EULA** | Steam デフォルトの EULA を使用（カスタムも可） |
| **プライバシーポリシー** | 用意推奨（レジストリ読み取りのため） |
| **サードパーティ著作権** | NVIDIA NVAPI を利用（再配布は許可されている） |
| **サポートURL** | https://github.com/meisouman2000-sudo/Project-GamevisionTuner |

### プライバシーポリシーに記載すべき内容（案）

```
本ソフトウェアは以下のデータにアクセスします：
1. Windowsレジストリ（HKCU\Software\Valve\Steam\RunningAppID）
   — Steam で実行中のゲームを検知するため（読み取り専用）
2. Steam ライブラリフォルダのゲームデータ
   — インストール済みゲームの一覧を取得するため（読み取り専用）
3. NVIDIA GPU 設定（NVAPI 経由）
   — デジタルバイブランスの読み書き

個人情報の収集・送信は一切行いません。
すべてのデータはローカルPC内でのみ処理されます。
```

---

## 11. SteamPipe ビルドアップロード手順（概要）

```bash
# 1. Steamworks SDK をダウンロード
#    https://partner.steamgames.com/downloads/list

# 2. ContentBuilder フォルダに移動
cd sdk/tools/ContentBuilder

# 3. ビルドファイルを content/ に配置
#    release/0.0.1/win-unpacked/ の中身をそのままコピー

# 4. app_build VDF ファイルを作成（App ID に合わせて編集）

# 5. アップロード実行
builder\steamcmd.exe +login <username> +run_app_build ..\scripts\app_build_XXXXX.vdf +quit
```

---

## ✅ チェックリスト（Steamworksダッシュボードで完了すべき項目）

- [ ] 基本情報（アプリ名・開発者名）入力
- [ ] 対応プラットフォーム → Windows のみ
- [ ] システム要件（最小/推奨）入力
- [ ] カテゴリ → Software > Utilities
- [ ] タグ設定
- [ ] 対応言語 → 日本語
- [ ] コンテンツレーティング → 全年齢
- [ ] Launch Options 設定
- [ ] デポ作成・ビルドアップロード
- [ ] ストアページテキスト入力（steamworks_store_text.md から転記）
- [ ] カプセル画像・スクリーンショットのアップロード
- [ ] プライバシーポリシー設定
- [ ] EULA 設定
- [ ] 審査提出（ストアページ → ビルド）
