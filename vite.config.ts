import { defineConfig } from 'vite'
import path from 'node:path'
import fs from 'node:fs'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { config as loadDotenv } from 'dotenv'

// .env を読み込んでビルド時に環境変数を確定させる
loadDotenv({ path: path.join(__dirname, '.env') })

// /lp と /lp/ で public/lp/index.html を返す（メインアプリのSPAフォールバックを避ける）
function serveLpIndex() {
  return {
    name: 'serve-lp-index',
    configureServer(server: {
      middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void; stack?: Array<{ route: string; handle: (req: any, res: any, next: () => void) => void }> }
    }) {
      const lpMiddleware = (req: any, res: any, next: () => void) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url === '/lp' || url === '/lp/') {
          const lpIndex = path.join(process.cwd(), 'public', 'lp', 'index.html')
          if (fs.existsSync(lpIndex)) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(fs.readFileSync(lpIndex, 'utf-8'))
            return
          }
        }
        next()
      }
      // 先頭に挿入して SPA フォールバックより前に /lp を処理
      const stack = (server.middlewares as any).stack
      if (Array.isArray(stack)) {
        stack.unshift({ route: '', handle: lpMiddleware })
      } else {
        server.middlewares.use(lpMiddleware)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  // ビルド時に process.env の値を文字列としてインライン化
  // → パッケージ済みexeでも .env ファイルなしで動作する
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL ?? ''),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY ?? ''),
    'process.env.STRIPE_MONTHLY_PRICE_ID': JSON.stringify(process.env.STRIPE_MONTHLY_PRICE_ID ?? ''),
    'process.env.STRIPE_YEARLY_PRICE_ID': JSON.stringify(process.env.STRIPE_YEARLY_PRICE_ID ?? ''),
    'process.env.CHECKOUT_SUCCESS_URL': JSON.stringify(process.env.CHECKOUT_SUCCESS_URL ?? ''),
    'process.env.CHECKOUT_CANCEL_URL': JSON.stringify(process.env.CHECKOUT_CANCEL_URL ?? ''),
  },
  plugins: [
    serveLpIndex(),
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          define: {
            'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL ?? ''),
            'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY ?? ''),
            'process.env.STRIPE_MONTHLY_PRICE_ID': JSON.stringify(process.env.STRIPE_MONTHLY_PRICE_ID ?? ''),
            'process.env.STRIPE_YEARLY_PRICE_ID': JSON.stringify(process.env.STRIPE_YEARLY_PRICE_ID ?? ''),
            'process.env.CHECKOUT_SUCCESS_URL': JSON.stringify(process.env.CHECKOUT_SUCCESS_URL ?? ''),
            'process.env.CHECKOUT_CANCEL_URL': JSON.stringify(process.env.CHECKOUT_CANCEL_URL ?? ''),
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
  ],
})
