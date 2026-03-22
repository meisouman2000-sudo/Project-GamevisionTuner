/**
 * verify-build.mjs
 * ビルド後の検証スクリプト：env var が dist-electron/main.js に正しくinlineされているか確認する。
 * 未検出の場合はエラーで終了（リリース前に必ず実行）。
 *
 * 使い方: node scripts/verify-build.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// .env を読み込む
loadEnv({ path: path.join(root, '.env') });

const mainJs = path.join(root, 'dist-electron', 'main.js');

if (!fs.existsSync(mainJs)) {
  console.error('❌ dist-electron/main.js が見つかりません。先に npm run build を実行してください。');
  process.exit(1);
}

const content = fs.readFileSync(mainJs, 'utf-8');

const checks = [
  {
    name: 'SUPABASE_URL',
    // URLのプロジェクトIDがmain.jsに含まれているか確認
    value: process.env.SUPABASE_URL?.replace('https://', '').split('.')[0],
  },
  {
    name: 'SUPABASE_ANON_KEY',
    // anonキーの最初の20文字で確認
    value: process.env.SUPABASE_ANON_KEY?.slice(0, 20),
  },
];

let allPassed = true;

console.log('\n🔍 ビルド検証: env var のinline確認\n');

for (const check of checks) {
  if (!check.value) {
    console.warn(`⚠️  ${check.name}: .env に値がないためスキップ`);
    continue;
  }

  if (content.includes(check.value)) {
    console.log(`✅ ${check.name}: inline済み`);
  } else {
    console.error(`❌ ${check.name}: main.js に見つかりません！ビルド設定を確認してください。`);
    allPassed = false;
  }
}

console.log('');

if (!allPassed) {
  console.error('❌ 検証失敗: env var が正しくinlineされていません。リリースを中止してください。');
  console.error('   → vite.config.ts の electron.main.vite.define を確認してください。');
  process.exit(1);
} else {
  console.log('✅ 検証成功: すべての env var が正しくinlineされています。');
}
