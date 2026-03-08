// ============================================================
// GameVision Tuner - Configuration (環境変数から読み込み)
// ============================================================
// キーはコードに書かず .env に記載してください。
// .env.example をコピーして .env を作成し、値を入力してください。
// ============================================================

import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env はプロジェクトルートに置く（開発時）。複数パスを試す
const possiblePaths = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
];
for (const p of possiblePaths) {
  loadEnv({ path: p });
  if (process.env.SUPABASE_URL) break;
}

function getEnv(key: string): string {
  const v = process.env[key];
  if (v === undefined || v === '') {
    console.warn(`[Config] Missing env: ${key}. Add it to .env (see .env.example)`);
    return '';
  }
  return v;
}

export const SUPABASE_URL = getEnv('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

export const STRIPE_MONTHLY_PRICE_ID = getEnv('STRIPE_MONTHLY_PRICE_ID');
export const STRIPE_YEARLY_PRICE_ID = getEnv('STRIPE_YEARLY_PRICE_ID');

export const CHECKOUT_SUCCESS_URL = getEnv('CHECKOUT_SUCCESS_URL') || 'https://your-lp.com/success';
export const CHECKOUT_CANCEL_URL = getEnv('CHECKOUT_CANCEL_URL') || 'https://your-lp.com/cancel';

export const AUTH_CALLBACK_URL = 'http://localhost/auth/callback';
