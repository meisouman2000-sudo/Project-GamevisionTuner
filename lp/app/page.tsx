import {
  Monitor,
  Sliders,
  Download,
  ExternalLink,
  ChevronDown,
  Shield,
  Cpu,
  Zap,
  Crosshair,
  EyeOff,
  Wrench,
  Flame,
  RefreshCw,
  RotateCcw,
  Gauge,
  Rocket,
  Sparkles,
  Gamepad2,
  Crown,
  Check,
  X,
  ImagePlus,
} from 'lucide-react'

const STEAM_URL =
  'https://store.steampowered.com/app/XXXXXX/GameVision_Tuner/'
const DOWNLOAD_URL = '#' // Windows版ダウンロードURL（GitHub Releases / 公式サイト等に要設定）

const HERO_PARTICLES = [
  { x: 8, y: 15, size: 3, delay: 0, duration: 14 },
  { x: 22, y: 25, size: 2, delay: 2, duration: 16 },
  { x: 75, y: 20, size: 4, delay: 1, duration: 13 },
  { x: 90, y: 35, size: 2, delay: 3, duration: 15 },
  { x: 15, y: 55, size: 3, delay: 1.5, duration: 17 },
  { x: 50, y: 45, size: 2, delay: 0.5, duration: 12 },
  { x: 85, y: 60, size: 3, delay: 2.5, duration: 14 },
  { x: 30, y: 70, size: 2, delay: 4, duration: 18 },
  { x: 65, y: 75, size: 3, delay: 1, duration: 15 },
  { x: 5, y: 40, size: 2, delay: 3.5, duration: 16 },
  { x: 95, y: 50, size: 2, delay: 0.8, duration: 13 },
  { x: 40, y: 18, size: 3, delay: 2, duration: 14 },
  { x: 58, y: 28, size: 2, delay: 1.2, duration: 17 },
  { x: 12, y: 82, size: 2, delay: 2.8, duration: 15 },
  { x: 78, y: 12, size: 3, delay: 0.3, duration: 16 },
  { x: 25, y: 42, size: 2, delay: 3.2, duration: 12 },
  { x: 70, y: 52, size: 3, delay: 1.8, duration: 14 },
  { x: 45, y: 65, size: 2, delay: 2.2, duration: 18 },
  { x: 88, y: 78, size: 2, delay: 0.6, duration: 13 },
  { x: 18, y: 32, size: 3, delay: 4.2, duration: 15 },
  { x: 62, y: 38, size: 2, delay: 1.4, duration: 16 },
  { x: 35, y: 58, size: 2, delay: 2.6, duration: 14 },
  { x: 82, y: 42, size: 3, delay: 0.9, duration: 17 },
  { x: 52, y: 8, size: 2, delay: 3.8, duration: 12 },
  { x: 8, y: 68, size: 2, delay: 1.6, duration: 15 },
  { x: 92, y: 22, size: 3, delay: 2.4, duration: 14 },
  { x: 38, y: 85, size: 2, delay: 0.2, duration: 16 },
  { x: 72, y: 65, size: 2, delay: 3.4, duration: 13 },
  { x: 48, y: 52, size: 3, delay: 2.1, duration: 18 },
]

const faqItems = [
  {
    q: 'NVIDIA GPUじゃないと使えませんか？',
    a: 'はい、GameVision TunerはNVIDIAの公式API（NVAPI）を使用してディスプレイ設定を制御するため、NVIDIA GeForceシリーズのGPUが必須です。AMD・Intel GPUには対応していません。',
  },
  {
    q: 'ゲームのFPSに影響はありますか？',
    a: 'ほぼゼロです。バックグラウンド監視のCPU負荷は0.1%未満で、ゲームのパフォーマンスに影響を与えることはありません。軽量なレジストリポーリング方式を採用しています。',
  },
  {
    q: '無料で使えますか？',
    a: 'フリープランでは1タイトルまで登録可能です。複数のゲームを管理したい場合は、Proプランにアップグレードすることで無制限にゲームを登録できます。',
  },
  {
    q: 'ゲーム中にアプリがクラッシュしたらどうなりますか？',
    a: '安心してください。セーフティ設計により、アプリが異常終了した場合でも、次回起動時に元のディスプレイ設定が自動復元されます。設定が壊れたままになることはありません。',
  },
  {
    q: 'Steam以外のゲームにも対応していますか？',
    a: '現在はSteamクライアント経由でのゲーム検出に対応しています。Steamライブラリに登録されているすべてのタイトルが対象です。',
  },
  {
    q: 'どんなディスプレイ設定を変更できますか？',
    a: 'デジタルバイブランス（Digital Vibrance）、明るさ（Brightness）、コントラスト（Contrast）、ガンマ（Gamma）の4項目をゲームごとに個別設定できます。',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

/* ─────────────────────────────────────────────
   Image Placeholder
   ───────────────────────────────────────────── */
function ImagePlaceholder({
  label,
  sub,
  aspectClass = 'aspect-video',
  className = '',
}: {
  label: string
  sub?: string
  aspectClass?: string
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.03] border-2 border-dashed border-white/[0.08] ${aspectClass} flex items-center justify-center group hover:border-electric-cyan/20 hover:bg-white/[0.04] transition-all ${className}`}
    >
      <div className="text-center text-white/15 group-hover:text-white/25 transition-colors px-4">
        <ImagePlus size={36} className="mx-auto mb-3 opacity-60" />
        <p className="text-sm font-bold">{label}</p>
        {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Navbar
   ───────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060F1F]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Monitor
              className="text-electric-cyan"
              size={24}
              strokeWidth={1.5}
            />
            <Sliders
              size={12}
              className="text-juicy-green absolute -bottom-0.5 -right-0.5"
              strokeWidth={2.5}
            />
          </div>
          <span className="font-black text-lg tracking-tight">
            GAMEVISION <span className="text-electric-cyan">TUNER</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60 font-medium">
          <a href="#features" className="hover:text-white transition-colors">
            機能
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            使い方
          </a>
          <a href="#games" className="hover:text-white transition-colors">
            対応ゲーム
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            料金
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-electric-cyan text-[#060F1F] px-5 py-2 rounded-lg font-bold text-sm hover:bg-electric-cyan/90 transition-colors flex items-center gap-2"
        >
          <Download size={14} />
          Windows版をダウンロード
        </a>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-8 overflow-hidden">
      {/* 案①: パーティクル背景 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {HERO_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#060F1F]/50 via-transparent to-[#060F1F]" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 hero-glow" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* 1行目: テキスト + 画像 */}
        <div className="w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-4 mb-10">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-electric-cyan/10 border border-electric-cyan/20 rounded-full px-5 py-2 mb-8">
              <Crosshair size={14} className="text-electric-cyan" />
              <span className="text-xs font-bold text-electric-cyan tracking-wider uppercase">
                NVIDIA Display Optimizer for FPS Gamers
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              暗闇の敵が、
              <br />
              <span className="text-electric-cyan text-glow-cyan">
                丸見えになる。
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              ゲームの起動を自動検知し、NVIDIAディスプレイ設定を瞬時に最適化。
              デジタルバイブランス・明るさ・コントラストをゲーム別に自動切り替え。
              終了後は
              <strong className="text-white">あなたの元の設定に完璧復元</strong>
              します。
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2 text-white/40">
                <Shield size={16} className="text-juicy-green" />
                <span>安全設計</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/40">
                <Cpu size={16} className="text-juicy-green" />
                <span>CPU負荷 0.1%未満</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/40">
                <Zap size={16} className="text-juicy-green" />
                <span>完全自動</span>
              </div>
            </div>
          </div>

          {/* Right: Before/After monitor（透過素材・枠なし） */}
          <div className="flex-1 flex items-center justify-center lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-monitor.png"
              alt="GameVision Tuner — Before/After 比較。左は暗く敵が見えない画面、右はデジタルバイブランス適用後の鮮明な画面"
              width={700}
              height={450}
              className="w-full max-w-[600px] xl:max-w-[700px] h-auto"
            />
          </div>
        </div>

        {/* 2行目: CTA（文章と画像の下） */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-electric-cyan text-[#060F1F] px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,195,255,0.3)]"
          >
            <Download size={20} />
            Windows版をダウンロード
            <ExternalLink
              size={16}
              className="opacity-50 group-hover:opacity-100 transition-opacity"
            />
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 text-white/60 hover:text-white px-6 py-4 transition-colors font-bold"
          >
            詳しく見る
            <ChevronDown size={16} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Pain Points
   ───────────────────────────────────────────── */
function PainPoints() {
  const pains = [
    {
      icon: EyeOff,
      title: '暗所で敵が見えない',
      description:
        'デジタルバイブランスを上げれば視認性が劇的に向上する。でも毎回NVIDIAコントロールパネルを開くのは面倒すぎる…',
      color: 'text-panic-pink',
      bg: 'bg-panic-pink/10',
      border: 'border-panic-pink/20',
    },
    {
      icon: Wrench,
      title: '毎回手動で設定変更',
      description:
        'ゲームを起動するたびにコントロールパネルを開いて、スライダーを動かして…。この作業、何百回繰り返しましたか？',
      color: 'text-panic-orange',
      bg: 'bg-panic-orange/10',
      border: 'border-panic-orange/20',
    },
    {
      icon: Flame,
      title: 'ゲーム後の戻し忘れ',
      description:
        '高バイブランスのまま動画を観たり作業したり…。ギラギラ画面で目が疲れる。戻し忘れは地味にストレス。',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20',
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            こんな<span className="text-panic-pink">悩み</span>、ありませんか？
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            FPSゲーマーなら誰もが経験する、ディスプレイ設定の煩わしさ
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <div
              key={i}
              className={`scroll-fade-in ${pain.bg} border ${pain.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${pain.bg} flex items-center justify-center mb-4`}
              >
                <pain.icon size={24} className={pain.color} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${pain.color}`}>
                {pain.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {pain.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 scroll-fade-in">
          <p className="text-2xl md:text-3xl font-black">
            その悩み、
            <span className="text-electric-cyan text-glow-cyan">
              全部解決します。
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   App Showcase (Discord-style alternating layout)
   ───────────────────────────────────────────── */
function AppShowcase() {
  const showcases = [
    {
      badge: 'GAME LIBRARY',
      title: 'Steamライブラリから\nゲームを自動検出',
      description:
        'インストール済みのSteamゲームを自動でスキャン。お気に入りのFPSタイトルをワンクリックで追加するだけ。面倒なパス設定やID入力は一切不要です。',
      image: '/images/showcase-library.png',
      imageAlt: 'ゲームライブラリ一覧画面 — Steamから自動検出されたゲームをワンクリックで追加',
      icon: Gamepad2,
      iconColor: 'text-electric-cyan',
      reverse: false,
    },
    {
      badge: 'SETTINGS',
      title: '直感的なスライダーで\n完璧な設定を',
      description:
        '明るさ・コントラスト・ガンマ・デジタルバイブランスを直感的に調整。プレビュー機能でリアルタイムに画面を確認しながら、あなただけの最強プロファイルを作成。',
      image: '/images/showcase-settings-real.png',
      imageAlt: 'GameVision Tuner 設定画面 — スライダーでディスプレイ設定を調整しプロファイル保存',
      icon: Sliders,
      iconColor: 'text-juicy-green',
      reverse: true,
    },
    {
      badge: 'AUTO SWITCH',
      title: '起動から終了まで\nすべて自動',
      description:
        'ゲームの起動を自動検知し、保存済みプロファイルを瞬時に適用。終了後はあなたの元のデスクトップ設定に完璧復元。一度設定したら、あとは忘れてOK。',
      image: '/images/showcase-monitor.png',
      imageAlt: 'Before/After 比較 — デジタルバイブランス適用前後の視認性の変化',
      icon: RefreshCw,
      iconColor: 'text-electric-cyan',
      reverse: false,
    },
  ]

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        {showcases.map((item, i) => (
          <div
            key={i}
            className={`scroll-fade-in flex flex-col ${
              item.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-center gap-10 lg:gap-16`}
          >
            {/* Text side */}
            <div className="flex-1 text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 mb-5`}
              >
                <item.icon size={14} className={item.iconColor} />
                <span className="text-xs font-bold text-white/50 tracking-wider">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-5 whitespace-pre-line">
                {item.title}
              </h3>
              <p className="text-white/50 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {item.description}
              </p>
            </div>

            {/* Image side */}
            <div className="flex-1 w-full">
              <div className="relative">
                <div
                  className="absolute -inset-4 bg-electric-cyan/[0.04] blur-2xl rounded-3xl pointer-events-none"
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={600}
                  height={340}
                  className="relative w-full rounded-2xl border border-white/10 shadow-2xl shadow-black/40"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Features
   ───────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: Sliders,
      title: 'ゲーム別プロファイル',
      description:
        'ゲームごとに最適な明るさ・コントラスト・ガンマ・デジタルバイブランスを保存。一度設定すれば永久に記憶。',
    },
    {
      icon: RefreshCw,
      title: '完全自動切り替え',
      description:
        'Steamのゲーム起動を自動検知し、保存済みプロファイルを瞬時に適用。手動操作は一切不要。',
    },
    {
      icon: RotateCcw,
      title: 'パーフェクト復元',
      description:
        '初期値（50%）に戻すのではなく、あなたが普段使っている「いつもの設定」を記憶して完璧に復元。',
    },
    {
      icon: Gauge,
      title: '超軽量設計',
      description:
        'CPU負荷0.1%未満。バックグラウンドで動作してもFPSに影響ゼロ。ゲーミングPCの邪魔はしません。',
    },
    {
      icon: Rocket,
      title: 'ワンクリック起動',
      description:
        '「GO!」ボタンひとつで設定適用→ゲーム起動まで一直線。面倒なステップはゼロ。',
    },
    {
      icon: Shield,
      title: 'セーフティ設計',
      description:
        '異常終了・クラッシュ・強制終了…どんな状況でも元の設定を安全に復元。堅牢なフェイルセーフ。',
    },
  ]

  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: "url('/images/features-bg.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060F1F] via-transparent to-[#060F1F] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <div className="inline-flex items-center gap-2 bg-juicy-green/10 border border-juicy-green/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-juicy-green" />
            <span className="text-xs font-bold text-juicy-green tracking-wider">
              FEATURES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            すべてを自動化する、
            <span className="text-electric-cyan">6つの機能</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            GameVision Tunerがディスプレイ設定を完全に管理します
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="scroll-fade-in card-glow bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-electric-cyan/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-electric-cyan/10 flex items-center justify-center mb-4 group-hover:bg-electric-cyan/20 transition-colors">
                <feature.icon size={24} className="text-electric-cyan" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   How It Works
   ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'ゲームを登録',
      description:
        'Steamライブラリから自動検出されたゲームの中から、設定を最適化したいタイトルを選んで追加します。',
      icon: Gamepad2,
      image: '/images/step-add-game.png',
      imageAlt: 'ゲームライブラリからタイトルを選んで追加する画面',
    },
    {
      num: '02',
      title: '設定を調整',
      description:
        '直感的なスライダーで明るさ・コントラスト・ガンマ・デジタルバイブランスをお好みに調整して保存。',
      icon: Sliders,
      image: '/images/step-adjust.png',
      imageAlt: 'ディスプレイ設定スライダーを操作してプロファイルを保存する画面',
    },
    {
      num: '03',
      title: 'あとは全自動',
      description:
        'ゲーム起動で設定を自動適用、終了で自動復元。あなたはゲームに集中するだけ。',
      icon: Zap,
      image: '/images/step-auto.png',
      imageAlt: 'ゲーム起動→設定適用→終了→復元の自動フロー図',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            使い方は、
            <span className="text-juicy-green">たったの3ステップ</span>
          </h2>
          <p className="text-white/50">シンプルだから、すぐ使える</p>
        </div>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`scroll-fade-in flex flex-col ${
                i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              } items-center gap-8`}
            >
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                    <step.icon size={26} className="text-electric-cyan" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-juicy-green text-[#060F1F] text-xs font-black flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                </div>
                <p className="text-white/50 leading-relaxed max-w-md mx-auto md:mx-0">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  width={600}
                  height={340}
                  className="w-full rounded-2xl border border-white/[0.08] shadow-xl shadow-black/30"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Game Showcase
   ───────────────────────────────────────────── */
function GameShowcase() {
  const games = [
    'Valorant',
    'Counter-Strike 2',
    'Apex Legends',
    'Fortnite',
    'Overwatch 2',
    'Rainbow Six Siege',
    'PUBG: BATTLEGROUNDS',
    'Call of Duty',
    'Escape from Tarkov',
    'Destiny 2',
    'Team Fortress 2',
    'Battlefield 2042',
  ]

  return (
    <section id="games" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-juicy-green/[0.015] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            人気<span className="text-electric-cyan">FPSタイトル</span>に対応
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Steamで配信されているすべてのゲームに対応。
            <br className="hidden md:block" />
            お気に入りのタイトルをリストに追加するだけで、自動最適化が始まります。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {games.map((game) => (
            <div
              key={game}
              className="scroll-fade-in bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-center hover:border-electric-cyan/30 hover:bg-electric-cyan/[0.04] transition-all group"
            >
              <div className="flex items-center justify-center gap-2.5">
                <Crosshair
                  size={14}
                  className="text-electric-cyan/30 group-hover:text-electric-cyan/70 transition-colors shrink-0"
                />
                <span className="font-bold text-sm text-white/70 group-hover:text-white transition-colors">
                  {game}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-8 scroll-fade-in">
          …その他、Steamで配信されている<strong>全タイトル</strong>に対応
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Pricing
   ───────────────────────────────────────────── */
function Pricing() {
  const sharedFeatures = [
    '自動切り替え',
    '自動復元（パーフェクト復元）',
    'ワンクリック起動',
    'セーフティ設計',
    'Windows 起動時に自動スタート',
  ]

  return (
    <section id="pricing" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-cyan/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            シンプルな<span className="text-electric-cyan">料金プラン</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            まずは無料で体験。もっと使いたくなったらProへ。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 scroll-fade-in">
          {/* Free Plan */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white/60 mb-1">Free</h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">¥0</span>
                <span className="text-white/30 text-sm mb-1">/ 永久無料</span>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 text-white/70">
                <Gamepad2 size={18} className="text-white/30 shrink-0" />
                <span className="font-bold">
                  ゲーム登録{' '}
                  <span className="text-electric-cyan">1タイトル</span>
                </span>
              </div>
            </div>

            <ul className="space-y-3 flex-1">
              {sharedFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check
                    size={16}
                    className="text-juicy-green shrink-0"
                  />
                  <span className="text-white/60">{f}</span>
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm">
                <X size={16} className="text-white/20 shrink-0" />
                <span className="text-white/25">複数ゲーム対応</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <X size={16} className="text-white/20 shrink-0" />
                <span className="text-white/25">優先サポート</span>
              </li>
            </ul>

            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full text-center bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-bold py-3.5 rounded-xl transition-colors border border-white/[0.08]"
            >
              無料ではじめる
            </a>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-b from-electric-cyan/[0.06] to-transparent border-2 border-electric-cyan/20 rounded-2xl p-8 flex flex-col shadow-[0_0_40px_rgba(0,195,255,0.06)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-electric-cyan text-[#060F1F] text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1.5">
                <Crown size={12} />
                おすすめ
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-electric-cyan mb-1">
                Pro
              </h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">¥—</span>
                <span className="text-white/30 text-sm mb-1">/ 月</span>
              </div>
              <p className="text-xs text-white/30 mt-1">
                ※ 価格は近日公開
              </p>
            </div>

            <div className="mb-8 pb-6 border-b border-electric-cyan/10">
              <div className="flex items-center gap-3 text-white/90">
                <Gamepad2 size={18} className="text-electric-cyan shrink-0" />
                <span className="font-bold">
                  ゲーム登録{' '}
                  <span className="text-electric-cyan">無制限</span>
                </span>
              </div>
            </div>

            <ul className="space-y-3 flex-1">
              {sharedFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check
                    size={16}
                    className="text-juicy-green shrink-0"
                  />
                  <span className="text-white/70">{f}</span>
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm">
                <Check
                  size={16}
                  className="text-electric-cyan shrink-0"
                />
                <span className="text-white/90 font-bold">
                  複数ゲーム対応（無制限）
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check
                  size={16}
                  className="text-electric-cyan shrink-0"
                />
                <span className="text-white/90 font-bold">優先サポート</span>
              </li>
            </ul>

            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full text-center bg-electric-cyan hover:bg-electric-cyan/90 text-[#060F1F] font-black py-3.5 rounded-xl transition-colors"
            >
              Proにアップグレード
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   System Requirements
   ───────────────────────────────────────────── */
function SystemRequirements() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-black mb-4">動作環境</h2>
        </div>

        <div className="scroll-fade-in grid md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="font-bold text-white/80 mb-4 flex items-center gap-2">
              <Monitor size={18} className="text-white/40" />
              最小要件
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <span className="text-white/70 font-bold">OS：</span>Windows 10
                (64bit)
              </li>
              <li>
                <span className="text-white/70 font-bold">CPU：</span>1 GHz 以上
              </li>
              <li>
                <span className="text-white/70 font-bold">RAM：</span>4 GB
              </li>
              <li>
                <span className="text-white/70 font-bold">GPU：</span>NVIDIA
                GeForce シリーズ{' '}
                <span className="text-panic-pink font-bold">（必須）</span>
              </li>
              <li>
                <span className="text-white/70 font-bold">ストレージ：</span>200
                MB
              </li>
              <li>
                <span className="text-white/70 font-bold">その他：</span>Steam
                クライアント
              </li>
            </ul>
          </div>

          <div className="bg-electric-cyan/[0.04] border border-electric-cyan/10 rounded-2xl p-6">
            <h3 className="font-bold text-electric-cyan mb-4 flex items-center gap-2">
              <Sparkles size={18} />
              推奨スペック
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <span className="text-white/70 font-bold">OS：</span>Windows 11
                (64bit)
              </li>
              <li>
                <span className="text-white/70 font-bold">GPU：</span>NVIDIA
                GeForce GTX 1060 以上
              </li>
              <li>
                <span className="text-white/70 font-bold">ストレージ：</span>200
                MB
              </li>
            </ul>
          </div>
        </div>

        <div className="scroll-fade-in mt-6 bg-panic-pink/[0.06] border border-panic-pink/10 rounded-xl p-4 text-center">
          <p className="text-sm text-panic-pink/80">
            <strong>NVIDIA GPU 専用ツールです。</strong> AMD / Intel GPU
            には対応していません。
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────── */
function FAQ() {
  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            よくある<span className="text-electric-cyan">質問</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((faq, i) => (
            <details
              key={i}
              className="scroll-fade-in group bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/10 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-white/90 select-none list-none">
                <span className="pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="text-white/30 faq-chevron transition-transform duration-300 shrink-0"
                />
              </summary>
              <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Final CTA
   ───────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: "url('/images/cta-bg.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060F1F]/80 via-transparent to-[#060F1F]/80 pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center scroll-fade-in">
        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          面倒な設定変更は
          <br />
          <span className="text-electric-cyan text-glow-cyan">
            もう終わり。
          </span>
        </h2>
        <p className="text-lg text-white/50 mb-10">
          あとはゲームに集中するだけ。
          <br />
          Good Luck, Have Fun!
        </p>

        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-electric-cyan text-[#060F1F] px-10 py-5 rounded-xl font-black text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,195,255,0.3)]"
        >
          <Download size={24} />
          Windows版をダウンロード
        </a>

        <p className="mt-6 text-xs text-white/30">
          Windows 10/11 | NVIDIA GPU 専用 | Steam 必須
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Footer
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <Monitor size={16} className="text-electric-cyan/40" />
          <span className="font-bold">GAMEVISION TUNER</span>
        </div>
        <p className="text-xs text-white/20">
          &copy; {new Date().getFullYear()} Catnap Studio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <AppShowcase />
        <Features />
        <HowItWorks />
        <GameShowcase />
        <Pricing />
        <SystemRequirements />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
