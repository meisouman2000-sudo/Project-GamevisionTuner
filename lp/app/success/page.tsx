import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ご購入ありがとうございます | GameVision Tuner',
  robots: { index: false, follow: false },
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">✓</div>
        <h1 className="text-3xl font-black">ご購入ありがとうございます</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Pro プランの有効化が完了しました。<br />
          アプリを再起動すると、すべての機能が利用できるようになります。
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4"
        >
          &larr; トップに戻る
        </Link>
      </div>
    </main>
  )
}
