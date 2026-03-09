import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '利用規約 | GameVision Tuner',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              &larr; トップに戻る
            </Link>
            <h1 className="mt-3 text-3xl font-black">利用規約</h1>
            <p className="mt-2 text-sm text-white/50">
              この利用規約（以下「本規約」といいます）は、GameVision Tuner
              （以下「本サービス」といいます）の利用条件を定めるものです。
            </p>
          </div>
        </header>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-white/80">
          <section>
            <h2 className="text-xl font-bold mb-2">1. 適用</h2>
            <p>
              本規約は、本サービスの提供および利用に関する一切の関係に適用されます。
              当方が本サービス上で随時掲載するガイドライン等は、本規約の一部を構成するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. アカウントおよび認証</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                本サービスの一部機能は、Google
                アカウントによるログイン（Google OAuth）を必要とします。
              </li>
              <li>
                ユーザーは、自己の責任においてアカウント情報を管理し、第三者に利用させてはなりません。
              </li>
              <li>
                アカウントの不正利用により生じた損害について、当方は故意・重過失がない限り責任を負いません。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. 有料プラン（サブスクリプション）</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                有料プランの料金・機能・支払方法等は、本サービスの LP
                またはストアページに表示される内容に従います。
              </li>
              <li>有料プランの決済およびサブスクリプション管理は Stripe により行われます。</li>
              <li>
                有料プランは自動更新型のサブスクリプションとして提供され、ユーザーが解約手続きを行わない限り自動的に更新されます。
              </li>
              <li>
                解約はアプリ内の管理画面または Stripe
                カスタマーポータルからいつでも行うことができます。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. 禁止事項</h2>
            <p className="mb-2">
              ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスまたは第三者の権利・利益を侵害する行為</li>
              <li>
                本ソフトウェアのリバースエンジニアリング、逆コンパイル、逆アセンブル等の解析行為
              </li>
              <li>
                本サービスの不正利用、過度な負荷をかける行為、セキュリティを侵害する行為
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. 免責事項</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                当方は、本サービスがユーザーの特定の目的に適合すること、期待する機能・正確性・有用性を有することについて、一切保証しません。
              </li>
              <li>
                当方は、本サービスの提供の中断・停止・変更等によりユーザーに生じた損害について、法令上許容される範囲で責任を負いません。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. 規約の変更</h2>
            <p>
              当方は、本規約の内容を変更することがあります。変更後の本規約は、本サービス上での表示その他の方法によりユーザーに周知した時点から効力を生じます。
            </p>
          </section>
        </section>
      </div>
    </main>
  )
}

