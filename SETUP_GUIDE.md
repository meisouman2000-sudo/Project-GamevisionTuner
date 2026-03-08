# GameVision Tuner - Stripe + Supabase セットアップガイド

## 1. Supabase セットアップ

### 1-1. Google OAuth 有効化
1. **Supabase Dashboard** → Authentication → Providers → Google を有効化
2. **Google Cloud Console** → APIs & Services → Credentials
   - OAuth 2.0 Client ID を作成（Web application）
   - Authorized redirect URI に追加:
     ```
     https://YOUR_PROJECT.supabase.co/auth/v1/callback
     ```
   - Client ID と Client Secret を Supabase の Google Provider に入力
3. **Supabase Dashboard** → Authentication → URL Configuration
   - Redirect URLs に追加:
     ```
     http://localhost/auth/callback
     ```

### 1-2. データベーステーブル作成
1. **Supabase Dashboard** → SQL Editor
2. `supabase/migrations/001_create_subscriptions.sql` の内容を貼り付けて実行

### 1-3. Supabase の値をメモ
- Dashboard → Settings → API から:
  - `Project URL` → `SUPABASE_URL`
  - `anon public key` → `SUPABASE_ANON_KEY`
  - `service_role key` → Edge Functions 用（後で使用）

---

## 2. Stripe セットアップ

### 2-1. 商品・価格の作成
1. **Stripe Dashboard** → Products → Add Product
   - 名前: `GameVision Tuner Pro`
   - 価格1: ¥300 / 月 (Recurring, Monthly) → `price_xxxxx` をメモ
   - 価格2: ¥2,880 / 年 (Recurring, Yearly) → `price_xxxxx` をメモ

### 2-2. Customer Portal 有効化
1. **Stripe Dashboard** → Settings → Billing → Customer Portal
2. 有効化して、解約・プラン変更を許可

### 2-3. Webhook 設定
1. **Stripe Dashboard** → Developers → Webhooks → Add endpoint
   - URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
2. Signing secret (`whsec_...`) をメモ

### 2-4. API キーをメモ
- Dashboard → Developers → API keys
  - `Secret key` (`sk_test_...`) → Edge Functions 用

---

## 3. アプリ設定（キーはコードに書かず .env で管理）

### 3-1. .env を作成
1. プロジェクトルートに **`.env`** を作成する（`.env.example` をコピーして使うとよい）
2. 次の値を入力する（1・2 で取得した値）:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
STRIPE_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_YEARLY_PRICE_ID=price_xxxxx
CHECKOUT_SUCCESS_URL=https://your-lp.com/success
CHECKOUT_CANCEL_URL=https://your-lp.com/cancel
```

3. **`.env` は Git にコミットしない**（すでに .gitignore に含まれています）

---

## 4. Supabase Edge Functions デプロイ

### 4-1. Supabase CLI インストール
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 4-2. シークレット設定
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
supabase secrets set CHECKOUT_SUCCESS_URL=https://your-lp.com/success
supabase secrets set CHECKOUT_CANCEL_URL=https://your-lp.com/cancel
```

### 4-3. デプロイ
```bash
supabase functions deploy create-checkout
supabase functions deploy create-portal
supabase functions deploy stripe-webhook --no-verify-jwt
```

> `stripe-webhook` は JWT 検証なし（Stripe が直接叩くため）

---

## 5. 動作確認チェックリスト

- [ ] アプリ起動 → ログインなしで無料プラン（ゲーム1つ）が使える
- [ ] 「Proにアップグレード」→ Google ログインウィンドウが開く
- [ ] Google ログイン成功 → Stripe Checkout に遷移
- [ ] テストカード `4242 4242 4242 4242` で決済
- [ ] Webhook が Supabase に到達 → subscriptions テーブルが `active` / `pro` に更新
- [ ] アプリでサブスクモーダルを開き直す → Pro 表示
- [ ] ゲーム無制限で追加可能
- [ ] 「Stripeで管理」→ Customer Portal で解約可能

---

## テスト用 Stripe カード

| カード番号 | 結果 |
|-----------|------|
| `4242 4242 4242 4242` | 成功 |
| `4000 0000 0000 0002` | 拒否 |
| `4000 0000 0000 3220` | 3D Secure 要求 |

有効期限: 未来の任意の日付, CVC: 任意の3桁

---

## 6. 続きの開発プラン（本番まで）

**本番切り替えの前に LP を公開する理由**  
Google OAuth を「本番」で公開するには、同意画面の審査申請が必要です。審査では**アプリのホームページ・プライバシーポリシーなどが「公開済みでアクセスできること」が求められる**ため、LP がまだないと審査のしようがありません。まず LP（または最低限の公開ページ）を用意してから、本番切り替えと OAuth 審査に進むのが現実的です。

推奨する順序:

1. **LP（ランディングページ）を先に公開**
   - アプリの説明・ダウンロード導線・プライバシーポリシー・利用規約を掲載したページを公開する
   - **Vercel でデプロイする手順:** [docs/LP_Vercelデプロイ手順.md](docs/LP_Vercelデプロイ手順.md) を参照（リポジトリの **Root Directory** を `lp` に設定してデプロイ）
   - 成功/キャンセル用の URL（例: `https://your-lp.com/success`, `/cancel`）を決めておく
2. **4. Edge Functions デプロイ**（まだの場合）
   - `create-checkout`, `create-portal`, `stripe-webhook` をデプロイ
   - 4-2 のシークレット（Stripe キー・Webhook secret・**上記 LP の成功/キャンセル URL**）を設定
3. **Stripe Webhook 本番**
   - 本番用 Webhook エンドポイントを追加し、`stripe-webhook` の本番 URL を登録
   - 本番用 `whsec_...` を Supabase のシークレットに設定
4. **本番環境の切り替え**
   - 本番用 Supabase プロジェクト・本番用 Stripe に切り替え
   - `.env` を本番用 URL/キー/Price ID に更新（配布時はビルドに含めず、ユーザー設定や別サーバーから取得する運用も可）
5. **Google OAuth 本番**
   - 本番用リダイレクト URI を Google Cloud と Supabase に追加
   - 同意画面の「アプリのホームページ」「プライバシーポリシー」に **公開済み LP の URL** を設定してから審査申請
