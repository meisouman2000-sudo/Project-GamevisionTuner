# Supabase anon key と Stripe Price ID の取得手順

---

## 1. Supabase の anon key を取得する

1. **Supabase にログイン** → https://supabase.com/dashboard
2. 左メニューから **「Project Settings」**（歯車アイコン）をクリック
3. 左サイドバーで **「API」** をクリック
4. ページ内の **「Project API keys」** セクションを見る
5. 次の2つが表示されています：
   - **`anon` `public`** … これが **anon key** です（長い文字列、`eyJhbGciOi...` で始まります）
   - **`service_role` `secret`** … こちらは Edge Functions 用。**絶対にフロントや GitHub に載せない**

**コピーするもの**: `anon` の右側にある **「Reveal」→ 表示された長い文字列をコピー**

![場所のイメージ]
Project Settings → API → Project API keys → anon (public) の値

---

## 2. Stripe の Price ID を取得する

Price ID は「商品を作ったあと」に Stripe が自動で付ける ID です。  
まだ商品を作っていない場合は、先に商品を作成します。

### 2-1. 商品と価格を作成する（初回のみ）

1. **Stripe にログイン** → https://dashboard.stripe.com
2. 左メニュー **「商品カタログ」**（Products）をクリック
3. **「商品を追加」** をクリック
4. 次のように入力：
   - **名前**: `GameVision Tuner Pro`（任意）
   - **説明**: （空でOK）
   - **料金**:
     - **料金1**: 「料金を追加」→ **定期的な支払い** を選択  
       - 金額: **300** 円  
       - 請求の頻度: **毎月**  
       - 保存すると **Price ID** が発行されます（`price_xxxxx` 形式）
     - **料金2**: もう1つ「料金を追加」→ **定期的な支払い**  
       - 金額: **2880** 円  
       - 請求の頻度: **毎年**  
       - 保存すると別の **Price ID** が発行されます

### 2-2. Price ID を確認する

1. **商品カタログ** → 作成した商品（GameVision Tuner Pro）をクリック
2. その商品に紐づく **「料金」**（Prices）が一覧で出ます
3. 各料金の行に **「Price ID」** が表示されています（例: `price_1ABC123xyz...`）
   - **月額 ¥300** の行 → これが **STRIPE_MONTHLY_PRICE_ID**
   - **年額 ¥2,880** の行 → これが **STRIPE_YEARLY_PRICE_ID**
4. 右端の **「⋯」メニュー** から **「ID をコピー」** でコピーできます

**テストモード**（開発中）のときは、Price ID は `price_` で始まり、本番に切り替えると別の ID になります。

---

## 3. 取得した値を .env に設定する

プロジェクトルートの **`.env`** に、取得した値を入れます（キーはコードに書かず .env で管理）。

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
STRIPE_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_YEARLY_PRICE_ID=price_yyyyy
CHECKOUT_SUCCESS_URL=https://your-lp.com/success
CHECKOUT_CANCEL_URL=https://your-lp.com/cancel
```
