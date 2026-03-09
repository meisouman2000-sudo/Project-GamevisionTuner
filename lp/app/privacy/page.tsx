import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | GameVision Tuner',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PrivacyPage() {
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
            <h1 className="mt-3 text-3xl font-black">プライバシーポリシー</h1>
            <p className="mt-2 text-sm text-white/50">
              GameVision Tuner（以下「本サービス」といいます）は、ユーザーの個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
            </p>
          </div>
        </header>

        <section className="mt-10 space-y-8 text-sm leading-relaxed text-white/80">
          <section>
            <h2 className="text-xl font-bold mb-2">1. 事業者情報</h2>
            <p>
              本サービスの運営者（以下「当方」といいます）は、個人開発者として本サービスを提供します。
              具体的な氏名・住所等は「特定商取引法に基づく表記」のページにて開示します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. 取得する情報</h2>
            <p className="mb-2">
              当方は、本サービスの提供にあたり、主に以下の情報を取得する場合があります。
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google アカウント情報（メールアドレス、表示名、プロフィール画像等）</li>
              <li>Supabase により発行されるユーザーID等の識別子</li>
              <li>サブスクリプション情報（プラン種別、ステータス、有効期限、Stripe の顧客ID 等）</li>
              <li>アプリの利用状況に関するログ情報・エラーレポート</li>
              <li>お問い合わせ時にユーザーが任意に入力した情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. 利用目的</h2>
            <p className="mb-2">取得した情報は、次の目的のために利用します。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスの提供・維持・保護および改善のため</li>
              <li>ユーザー認証およびサブスクリプション状態の確認のため</li>
              <li>決済・請求・返金等のサブスクリプション管理のため</li>
              <li>不正利用の防止およびセキュリティ対策のため</li>
              <li>お問い合わせへの対応のため</li>
              <li>本サービスの品質向上、新機能の開発および利用状況の把握のため</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. 外部サービスの利用</h2>
            <p className="mb-2">
              当方は、以下の外部サービスを利用して本サービスを運営します。これらのサービス提供者に対して、必要な範囲でユーザー情報が提供される場合があります。
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supabase（認証・データベース）</li>
              <li>Google（OAuth 認証）</li>
              <li>Stripe（決済・サブスクリプション管理）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. Cookie 等の利用</h2>
            <p>
              本サービスでは、セッション管理や利便性向上のために Cookie や類似の技術を利用する場合があります。
              ブラウザの設定により Cookie を無効化することもできますが、その場合、本サービスの一部機能が正しく動作しない可能性があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. 開示・訂正・削除等の請求</h2>
            <p>
              ユーザーは、当方が保有する自己の個人情報について、開示・訂正・削除・利用停止等を求めることができます。
              手続きの詳細は、下記お問い合わせ窓口までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">7. お問い合わせ窓口</h2>
            <p>
              本ポリシーおよび個人情報の取扱いに関するお問い合わせは、別途案内するサポート窓口（メールアドレス等）までご連絡ください。
            </p>
          </section>
        </section>
      </div>
    </main>
  )
}

