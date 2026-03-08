@echo off
cd /d "%~dp0..\lp"
echo LPの開発サーバーを起動しています...
start "" cmd /k "npm run dev"
echo ブラウザで http://localhost:3000/ を開くか、Cursorで「Preview: LPをCursor内ブラウザで表示」タスクを実行してください。
