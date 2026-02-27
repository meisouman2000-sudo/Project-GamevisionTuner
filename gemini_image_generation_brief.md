# Gemini 画像生成用指示書

このドキュメントは、Google Gemini などのAIモデルを使用して、Steamストア掲載用の画像アセット（カプセル画像）を生成するための指示書です。
以下の手順とプロンプトをそのままGeminiに入力することで、アプリの世界観にマッチした高品質な画像を生成させることを目的としています。

---

## 1. アプリのコンセプトとデザイン言語

AIに生成させる前に、まず以下の「コンテキスト」を読み込ませてください。

**アプリ名**: GameVision Tuner
**ジャンル**: PCゲーマー向けディスプレイ設定ユーティリティ（FPS/競技シーン向け）
**キーワード**: Cyberpunk, Neon Tech, Professional, Gaming Tool, Monitor Control
**メインカラー**:
- **Deep Navy (背景)**: `#0A192F` (Dark, professional tech background)
- **Electric Cyan (アクセント)**: `#00F3FF` (Glowing neon accents, highly visible)
- **Juicy Green (アクション)**: `#58CC02` (Success, Go button, active state)

**デザインコード（CSSより抜粋）**:
- ダークモード基調のミニマルかつハイテクなUI
- ゲーミングモニター、スライダー操作、デジタルバイブランス調整を連想させるビジュアル
- 視認性の高い太字のサンセリフフォント

---

## 2. 生成する画像リスト

Steamストアで必須となる画像です。

| 画像タイプ | サイズ (px) | 優先度 | 用途 |
|------------|-------------|--------|------|
| **Header Capsule** | 460 x 215 | **最高** | ストアトップ、検索結果（「顔」となる画像） |
| **Main Capsule** | 616 x 353 | 高 | 詳細ページ上部 |
| **Small Capsule** | 231 x 87 | 中 | リスト表示 |
| **Vertical Capsule** | 374 x 448 | 低 | 特集エリア |

---

## 3. Gemini への入力プロンプト集

以下のプロンプトをGemini（画像生成対応モデル）に入力してください。
※ 英語で行うとより高品質な結果が得られやすいです。

### 基本スタイル（Style Reference）
> **Prompt:**
> Generate a high-quality digital art style image for a PC software product named "GameVision Tuner".
> **Style:** Cyberpunk tech interface, sleek, modern, professional software branding.
> **Colors:** Dark navy blue background (#0A192F), Neon Cyan (#00F3FF) glowing accents, Bright Green (#58CC02) highlights.
> **Subject:** A stylized abstract graphic of a computer monitor screen with adjustment sliders (brightness, contrast, digital vibrance) popping out in 3D or holographic style.
> **Mood:** High-performance, precision, gamer-focused.

### ① Header Capsule (460x215) 用プロンプト
> **Prompt:**
> Create a Steam store header capsule image (aspect ratio 460:215).
> **Composition:**
> - Left side: Large, bold text "GAMEVISION TUNER" in white sans-serif font with cyan neon outline.
> - Right side: A glowing holographic icon of a gaming monitor with vibrant equalizer bars or sliders.
> - Background: Deep dark navy blue with a subtle hexagonal mesh pattern.
> - Lighting: Cinematic lighting, cyan glow from the monitor icon illuminating the text properties.
> **Resolution:** High definition, sharp details.

### ② Main Capsule (616x353) 用プロンプト
> **Prompt:**
> Create a Steam store main capsule image (aspect ratio 616:353).
> **Composition:**
> - Center: A futuristic "Control Center" dashboard interface.
> - Elements: Multiple game icons (generalized) floating, connected to a central "Tuner" dial.
> - Text: "GAMEVISION TUNER" at the bottom center, bold and glowing.
> - Visuals: Visual representation of changing screen colors from "Dull" to "Vibrant" (Digital Vibrance effect).
> - Background: Dark tech environment (#0A192F).

### ③ 縦型カプセル (Vertical) 用プロンプト
> **Prompt:**
> Create a Steam store vertical capsule image (aspect ratio 374:448).
> **Composition:**
> - Vertical layout.
> - Top: "GAMEVISION TUNER" logo.
> - Center/Bottom: A vertical stack of stylized sliders (Brightness, Contrast, Vibrance) glowing in neon colors.
> - Background: Deep blue gradient, abstract circuit lines.

---

## 4. 生成後の加工（微調整）

AIで生成された画像は、文字が崩れている場合が多いです。以下の手順で仕上げることを推奨します：

1. **文字なしで生成させる**（オプション）
   - プロンプトから "text" の指定を外し、背景アートのみを生成させる。
2. **Canva や Photoshop で文字入れ**
   - 生成された背景画像の上に、別途 "GameVision Tuner" のロゴテキストを配置する。
   - フォントは太めのサンセリフ（Inter, Roboto, Montserratなど）を使用。
   - 色は白（#FFFFFF）またはシアン（#00F3FF）。

---

## 5. 参考コード（コンテキスト理解用）

Geminiに「どんなアプリ？」と聞かれたら、このコードを見せてください。

```tsx
// GameCard.tsx - UIの雰囲気を伝える
<div className="bg-[#112240] rounded-3xl border-2 border-transparent hover:border-electric-cyan/30">
    <div className="bg-gradient-to-br from-[#0d1b2a] to-[#112240]">
        {/* Game Cover Image */}
    </div>
    <button className="bg-juicy-green text-deep-navy font-black">
        GO!
    </button>
</div>
```
