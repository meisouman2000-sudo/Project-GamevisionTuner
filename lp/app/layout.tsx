import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Orbitron, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '600', '700', '900'],
})

const notoSansJP = Noto_Sans_JP({
  display: 'swap',
  variable: '--font-noto',
  weight: ['400', '700', '900'],
})

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  'https://project-gamevision-tuner.vercel.app'

/** 本番・公開用ドメイン（このホストだけ検索インデックス許可）。長いデプロイURLはプレビュー用で noindex */
const CANONICAL_HOST =
  process.env.NEXT_PUBLIC_CANONICAL_HOST ?? 'project-gamevision-tuner.vercel.app'

const SITE_NAME = 'GameVision Tuner'
const DESCRIPTION =
  'FPSゲーマー必携！NVIDIAディスプレイ設定をゲームごとに自動切り替え。デジタルバイブランス・明るさ・コントラスト・ガンマをワンクリックで最適化。ゲーム終了後は自動で元の設定に完璧復元。Valorant・CS2・Apex対応。'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const requestHost = headersList.get('host') ?? ''
  const isCanonical = requestHost === CANONICAL_HOST
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default:
        'GameVision Tuner | FPSゲーマーのためのNVIDIAディスプレイ設定自動切り替えツール',
      template: '%s | GameVision Tuner',
    },
    description: DESCRIPTION,
    keywords: [
      'NVIDIA',
      'デジタルバイブランス',
      '自動切り替え',
      'FPS',
      'ゲーム設定',
      'ディスプレイ設定',
      'NVIDIA コントロールパネル',
      '自動化',
      '画面設定',
      'ゲーミングツール',
      'GameVision Tuner',
      'デジタルバイブランス 自動',
      'FPS 視認性',
      'Valorant 設定',
      'CS2 画面設定',
      'Apex 明るさ',
      'NVAPI',
      'digital vibrance auto switch',
      'game display settings',
      'nvidia automation tool',
      'fps visibility settings',
    ],
    authors: [{ name: 'Catnap Studio' }],
    creator: 'Catnap Studio',
    publisher: 'Catnap Studio',
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      alternateLocale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: 'GameVision Tuner | 暗闇の敵が、丸見えになる。',
      description: DESCRIPTION,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'GameVision Tuner - NVIDIAディスプレイ設定自動切り替えツール',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GameVision Tuner | 暗闇の敵が、丸見えになる。',
      description: DESCRIPTION,
      images: ['/og-image.png'],
    },
    robots: isCanonical
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : { index: false, follow: false },
    alternates: {
      canonical: SITE_URL,
    },
  }
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GameVision Tuner',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Windows 10, Windows 11',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  description: DESCRIPTION,
  author: {
    '@type': 'Organization',
    name: 'Catnap Studio',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '120',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareJsonLd),
          }}
        />
      </head>
      <body
        className={`${orbitron.variable} ${notoSansJP.variable} font-noto bg-[#060F1F] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
