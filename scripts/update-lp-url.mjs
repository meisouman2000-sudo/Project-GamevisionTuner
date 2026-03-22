/**
 * update-lp-url.mjs
 * package.json のバージョンを読み、lp/app/page.tsx の DOWNLOAD_URL を自動更新する。
 * npm run release の前に実行される。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// package.json からバージョンを取得
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
const version = pkg.version;

// GitHub Releases のファイル名規則:
// productName "GameVision Tuner" → スペースがドットに変換される → "GameVision.Tuner"
const OWNER = 'meisouman2000-sudo';
const REPO = 'Project-GamevisionTuner';
const fileName = `GameVision.Tuner-Windows-${version}-Setup.exe`;
const newUrl = `https://github.com/${OWNER}/${REPO}/releases/download/v${version}/${fileName}`;

// lp/app/page.tsx を更新
const lpPagePath = path.join(root, 'lp', 'app', 'page.tsx');
const content = fs.readFileSync(lpPagePath, 'utf-8');

const updated = content.replace(
  /const DOWNLOAD_URL = '.*'/,
  `const DOWNLOAD_URL = '${newUrl}'`
);

import { execSync } from 'node:child_process';

if (content === updated) {
  console.log(`ℹ️  DOWNLOAD_URL は既に最新です: ${newUrl}`);
} else {
  fs.writeFileSync(lpPagePath, updated, 'utf-8');
  console.log(`✅ DOWNLOAD_URL を更新しました:`);
  console.log(`   ${newUrl}`);

  // git commit & push（Vercel自動デプロイを起動）
  execSync(`git add "${lpPagePath}"`, { cwd: root, stdio: 'inherit' });
  execSync(`git commit -m "lp: update download URL to v${version}"`, { cwd: root, stdio: 'inherit' });
  execSync(`git push origin main`, { cwd: root, stdio: 'inherit' });
  console.log(`✅ LP変更をプッシュしました（Vercelが自動デプロイします）`);
}
