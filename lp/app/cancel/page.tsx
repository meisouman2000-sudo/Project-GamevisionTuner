import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'お支払いがキャンセルされました | GameVision Tuner',
  robots: { index: false, follow: false },
}

export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl opacity-50">✕</div>
        <h1 className="text-3xl font-black">お支払いがキャンセルされました</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          決済はキャンセルされました。引き続き無料プランでご利用いただけます。<br />
          アップグレードはいつでも行えます。
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
