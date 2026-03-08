@echo off
cd /d "%~dp0.."
echo メインアプリの開発サーバーを起動しています...
start "" cmd /k "npm run dev"
echo ブラウザで http://localhost:5173/ を開くか、Cursorで「Preview: Cursor内ブラウザで表示」タスクを実行してください。
