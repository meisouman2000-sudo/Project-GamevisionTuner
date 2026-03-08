# Step 2: Supabase Auth（Google OAuth）有効化 + SQL 実行

この順番で進めてください。

---

## A. Google Cloud Console で OAuth クライアントを作る

1. **Google Cloud Console** を開く  
   https://console.cloud.google.com/

2. プロジェクトを選択（または「新しいプロジェクト」で作成）

3. 左メニュー **「API とサービス」** → **「認証情報」**

4. **「+ 認証情報を作成」** → **「OAuth クライアント ID」**

5. 初回なら **「OAuth 同意画面を構成」** を選ぶ  
   - ユーザータイプ: **外部**（テスト中は「テスト」で公開せずに使える）
   - アプリ名: `GameVision Tuner` など任意
   - ユーザーサポートメール・デベロッパー連絡先を入力して保存

6. 再度 **「認証情報」** → **「+ 認証情報を作成」** → **「OAuth クライアント ID」**
   - アプリケーションの種類: **ウェブアプリケーション**
   - 名前: `GameVision Tuner Supabase` など任意
   - **承認済みのリダイレクト URI** に以下を **1件ずつ追加**:
     ```
     https://fijmivtxzytdtyyrwadt.supabase.co/auth/v1/callback
     ```
   - **作成** をクリック

7. 表示された **クライアント ID** と **クライアント シークレット** をコピー（メモ帳などに貼っておく）

---

## B. Supabase Auth で Google プロバイダーを有効化

1. **Supabase Dashboard** を開く  
   https://supabase.com/dashboard  
   → プロジェクト **fijmivtxzytdtyyrwadt** を選択

2. 左メニュー **「Authentication」**（Supabase Auth）→ **「Providers」**

3. 一覧から **「Google」** をクリック

4. **「Enable Sign in with Google」** をオンにする

5. **Client ID** に、A-7 でコピーした **クライアント ID** を貼り付け

6. **Client Secret** に、A-7 でコピーした **クライアント シークレット** を貼り付け

7. **Save** をクリック

---

## C. Supabase Auth にリダイレクト URL を追加（アプリ用）

1. 同じプロジェクトで **「Authentication」**（Supabase Auth）→ **「URL Configuration」**

2. **「Redirect URLs」** の欄に次を **追加**（既にあればそのままでOK）:
   ```
   http://localhost/auth/callback
   ```

3. **Save** をクリック

---

## D. SQL を実行してテーブル・トリガーを作成

1. Supabase の左メニュー **「SQL Editor」** をクリック

2. **「New query」** で新しいクエリを開く

3. 下の SQL を **すべてコピー** してエディタに貼り付ける

4. **「Run」**（または Ctrl+Enter）で実行する

5. 成功すると「Success. No rows returned」などと表示される

```sql
-- ============================================================
-- GameVision Tuner - Subscriptions Table
-- ============================================================

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  plan text not null default 'free',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, status, plan)
  values (new.id, 'inactive', 'free');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

---

## 完了チェック

- [ ] Google Cloud で「ウェブアプリケーション」の OAuth クライアント ID を作成した
- [ ] リダイレクト URI に `https://fijmivtxzytdtyyrwadt.supabase.co/auth/v1/callback` を追加した
- [ ] Supabase の Providers で Google を有効化し、Client ID / Client Secret を入れた
- [ ] Supabase の URL Configuration に `http://localhost/auth/callback` を追加した
- [ ] SQL Editor で上記 SQL を実行し、エラーが出ていない

ここまで終わったら、アプリで「Proにアップグレード」→「Googleでサインイン」が使えるようになります。  
次は **Edge Functions（Stripe Checkout / Webhook）のデプロイ** に進んでください（SETUP_GUIDE の「4. Supabase Edge Functions デプロイ」）。
