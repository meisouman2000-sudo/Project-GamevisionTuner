import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | GameVision Tuner',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TokushoPage() {
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
            <h1 className="mt-3 text-3xl font-black">特定商取引法に基づく表記</h1>
            <p className="mt-2 text-sm text-white/50">
              GameVision Tuner の有料プランに関する特定商取引法第11条（通信販売についての広告）に基づく表記です。
            </p>
          </div>
        </header>

        <section className="mt-10 text-sm leading-relaxed text-white/80 space-y-6">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-white/10">
                <th className="w-40 text-left py-3 pr-4 font-bold text-white/70 align-top">
                  販売業者
                </th>
                <td className="py-3 text-white/80">
                  峯岸宏輔（Catnap Studio）
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  運営責任者
                </th>
                <td className="py-3 text-white/80">
                  峯岸宏輔
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  所在地
                </th>
                <td className="py-3 text-white/80">
                  請求があり次第、遅滞なく開示します
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  電話番号
                </th>
                <td className="py-3 text-white/80">
                  請求があり次第、遅滞なく開示します
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  連絡先
                </th>
                <td className="py-3 text-white/80">
                  メールアドレス：{' '}
                  <a
                    href="mailto:catnapstudio.support@gmail.com"
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    catnapstudio.support@gmail.com
                  </a>
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  販売価格
                </th>
                <td className="py-3 text-white/80">
                  各プランの価格は、本サービスの LP またはストアページに税込価格で表示します。
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  商品代金以外の必要料金
                </th>
                <td className="py-3 text-white/80">
                  インターネット接続に係る通信料金等は、ユーザーのご負担となります。
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  支払方法
                </th>
                <td className="py-3 text-white/80">
                  クレジットカード決済（Stripe による決済）
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  支払時期
                </th>
                <td className="py-3 text-white/80">
                  初回利用時：申込時に即時決済されます。
                  <br />
                  継続利用時：サブスクリプションの更新日に自動的に決済されます。
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  役務の提供時期
                </th>
                <td className="py-3 text-white/80">
                  決済完了後、ただちに有料プランの機能が利用可能になります。
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  返品・キャンセル
                </th>
                <td className="py-3 text-white/80">
                  デジタルコンテンツの性質上、支払完了後の任意のキャンセル・返金には応じられません。
                  ただし、法令により返金が義務付けられている場合を除きます。
                </td>
              </tr>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 font-bold text-white/70 align-top">
                  解約・サブスクリプションの停止
                </th>
                <td className="py-3 text-white/80">
                  ユーザーは、アプリ内の管理画面または Stripe
                  カスタマーポータルからいつでも解約手続きが可能です。
                  解約手続き完了後は次回以降の料金は請求されません。
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

