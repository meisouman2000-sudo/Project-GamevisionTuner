-- ============================================================
-- GameVision Tuner - Subscriptions Table
-- Supabase Dashboard → SQL Editor で実行してください
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

-- RLS: ユーザーは自分のレコードのみ読める
alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- 新規ユーザー登録時に自動でサブスクレコードを作成するトリガー
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
