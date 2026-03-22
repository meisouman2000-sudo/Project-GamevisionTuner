// ============================================================
// GameVision Tuner - Configuration
// ============================================================
// 開発時: dotenv が .env から読み込む
// ビルド時: vite.config.ts の define で process.env.X を文字列にinline化
//   → パッケージ済みexeでも .env ファイル不要
// ============================================================

import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 開発時のみ .env を読み込む（ビルド後はdefineでinline済みのため不要）
const possiblePaths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
];
for (const p of possiblePaths) {
  loadEnv({ path: p });
  if (process.env.SUPABASE_URL) break;
}

// 静的アクセス → vite.config.ts の define でビルド時にinline化される
export const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';
export const STRIPE_MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID ?? '';
export const STRIPE_YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID ?? '';
export const CHECKOUT_SUCCESS_URL = process.env.CHECKOUT_SUCCESS_URL ?? 'https://your-lp.com/success';
export const CHECKOUT_CANCEL_URL = process.env.CHECKOUT_CANCEL_URL ?? 'https://your-lp.com/cancel';
export const AUTH_CALLBACK_URL = 'http://localhost/auth/callback';
