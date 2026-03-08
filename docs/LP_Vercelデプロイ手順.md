# LP を Vercel にデプロイする手順

GameVision Tuner のランディングページ（`lp` フォルダ）を Vercel にデプロイするための手順です。

## 前提

- このリポジトリを **GitHub / GitLab / Bitbucket** にプッシュ済みであること
- [Vercel](https://vercel.com) のアカウントがあること

---

## 1. Vercel にプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. **Add New…** → **Project**
3. 対象の **Git リポジトリ** を選択（または GitHub 等と連携してリポジトリ一覧から選択）

---

## 2. ルートディレクトリを `lp` に設定

**重要:** このリポジトリはルートが Electron + Vite のメインアプリで、LP は `lp` サブフォルダにあります。

1. インポート画面で **Configure Project** を開く
2. **Root Directory** の **Edit** をクリック
3. **`lp`** と入力して確定
4. これで Vercel は `lp` をプロジェクトルートとしてビルドします（Next.js が自動検出されます）

---

## 3. 環境変数（任意）

LP 単体では必須の環境変数はありません。  
本番ドメインで正規 URL を固定したい場合のみ設定します。

| 名前 | 説明 | 例 |
|-----|------|-----|
| `NEXT_PUBLIC_SITE_URL` | サイトの絶対 URL | `https://project-gamevision-tuner.vercel.app` |
| `NEXT_PUBLIC_CANONICAL_HOST` | 正規ホスト（noindex 判定に使用） | `project-gamevision-tuner.vercel.app` |

未設定の場合は `layout.tsx` 内のデフォルト（`project-gamevision-tuner.vercel.app`）が使われます。  
Vercel の **Production / Preview** で同じ値や別ドメインを設定できます。

---

## 4. デプロイ実行

1. **Deploy** をクリック
2. ビルドが完了すると、本番 URL（例: `https://project-gamevision-tuner.vercel.app`）とプレビュー URL が表示されます
3. 以降は **main ブランチへの push** で自動的に本番デプロイされます

---

## 5. カスタムドメイン（任意）

1. Vercel のプロジェクト → **Settings** → **Domains**
2. 取得済みドメインを追加し、指示に従って DNS（CNAME または A レコード）を設定
3. 本番運用時は、上記の環境変数 `NEXT_PUBLIC_SITE_URL` と `NEXT_PUBLIC_CANONICAL_HOST` をそのドメインに合わせてください

---

## トラブルシュート

- **ビルドが「ルートに package.json がない」などで失敗する**  
  → **Root Directory** が `lp` になっているか確認してください。

- **画像や静的ファイルが 404 になる**  
  → `lp/public` 以下に配置したファイルは Next.js により `/` 直下で配信されます（例: `lp/public/images/hero-monitor.png` → `https://あなたのドメイン/images/hero-monitor.png`）。

- **Stripe の成功/キャンセル URL を本番 LP に合わせる**  
  → デプロイ後に確定した LP の URL（例: `https://project-gamevision-tuner.vercel.app/success`）を、Stripe の Checkout 設定や Supabase の Edge Functions のシークレット（`CHECKOUT_SUCCESS_URL`, `CHECKOUT_CANCEL_URL`）に設定してください。
