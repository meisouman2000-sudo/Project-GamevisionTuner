import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, CheckCircle, AlertCircle, X, Sparkles, ExternalLink, LogOut, Check } from 'lucide-react';
import { useT } from '../i18n-context';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  authState: AuthState;
  onSignIn: () => Promise<{ success: boolean; error?: string }>;
  onSignOut: () => Promise<void>;
  onCheckout: (interval: 'month' | 'year') => Promise<{ url: string | null; error?: string }>;
  onManage: () => Promise<{ url: string | null; error?: string }>;
  onOpenUrl: (url: string) => void;
  onRefreshAuth: () => Promise<void>;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  authState,
  onSignIn,
  onSignOut,
  onCheckout,
  onManage,
  onOpenUrl,
  onRefreshAuth,
}: SubscriptionModalProps) {
  const t = useT();
  const [signingIn, setSigningIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('year');
  const [error, setError] = useState<string | null>(null);

  const isPro = authState.subscription.plan === 'pro';

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    const result = await onSignIn();
    if (!result.success) {
      if (result.error !== 'Auth window closed by user') {
        setError(result.error || t('sub_error'));
      }
    } else {
      await onRefreshAuth();
    }
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    if (window.confirm(t('sub_signOutConfirm'))) {
      await onSignOut();
      await onRefreshAuth();
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError(null);

    if (!authState.loggedIn) {
      const signInResult = await onSignIn();
      if (!signInResult.success) {
        setCheckingOut(false);
        if (signInResult.error !== 'Auth window closed by user') {
          setError(signInResult.error || t('sub_error'));
        }
        return;
      }
      await onRefreshAuth();
    }

    const result = await onCheckout(selectedInterval);
    if (result.url) {
      onOpenUrl(result.url);
      onClose();
    } else {
      setError(t('sub_comingSoon'));
    }
    setCheckingOut(false);
  };

  const handleManage = async () => {
    setError(null);
    const result = await onManage();
    if (result.url) {
      onOpenUrl(result.url);
    } else if (result.error) {
      setError(t('sub_comingSoon'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a1628] w-[500px] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="relative p-6 pb-4 bg-gradient-to-b from-[#112240] to-transparent">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 rounded-lg hover:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center border border-amber-400/20">
                    <Crown size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">GameVision Tuner</h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      isPro
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-white/40 bg-white/5'
                    }`}>
                      {isPro ? <><Sparkles size={10} /> {t('sub_pro')}</> : t('sub_free')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Account info */}
                {authState.loggedIn && authState.user && (
                  <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                    {authState.user.avatarUrl ? (
                      <img src={authState.user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan text-xs font-bold">
                        {(authState.user.displayName || authState.user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/80 truncate">{authState.user.displayName || authState.user.email}</p>
                      <p className="text-[10px] text-white/30">{t('sub_loggedInAs')}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-white/20 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                      title={t('sub_signOut')}
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                )}

                {isPro ? (
                  /* ─── Pro Active View ─── */
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-500/5 to-amber-900/5 border border-amber-500/10 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-amber-400" />
                        <p className="text-sm font-bold text-amber-300">{t('sub_proPlan')}</p>
                      </div>
                      <p className="text-xs text-white/50">{t('sub_proDesc')}</p>
                      {authState.subscription.currentPeriodEnd && (
                        <p className="text-xs text-white/30 mt-2">
                          {t('sub_renewsAt')}: {new Date(authState.subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleManage}
                      className="w-full py-2.5 rounded-xl font-bold text-sm text-white/50 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={14} />
                      {t('sub_manageOnStripe')}
                    </button>
                  </div>
                ) : (
                  /* ─── Free → Upgrade View ─── */
                  <div className="space-y-4">
                    <p className="text-sm text-white/50">{t('sub_freeDesc')}</p>

                    {/* Plan Toggle */}
                    <div className="grid grid-cols-2 gap-3">
                      <PlanCard
                        label={t('sub_monthly')}
                        price={t('sub_monthlyPrice')}
                        selected={selectedInterval === 'month'}
                        onClick={() => setSelectedInterval('month')}
                      />
                      <PlanCard
                        label={t('sub_yearly')}
                        price={t('sub_yearlyPrice')}
                        badge={t('sub_yearlyDiscount')}
                        selected={selectedInterval === 'year'}
                        onClick={() => setSelectedInterval('year')}
                      />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/10"
                        >
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleCheckout}
                      disabled={signingIn || checkingOut}
                      className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
                        ${signingIn || checkingOut
                          ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-deep-navy shadow-[0_4px_0_#92400e] active:shadow-none active:translate-y-[4px] hover:from-amber-400 hover:to-amber-500'
                        }`}
                    >
                      {signingIn ? (
                        <><Spinner /> {t('sub_signingIn')}</>
                      ) : checkingOut ? (
                        <><Spinner /> {t('sub_subscribing')}</>
                      ) : authState.loggedIn ? (
                        <><Crown size={16} /> {t('sub_subscribe')}</>
                      ) : (
                        <><GoogleIcon /> {t('sub_signInGoogle')} &amp; {t('sub_subscribe')}</>
                      )}
                    </motion.button>

                    {!authState.loggedIn && (
                      <p className="text-[10px] text-white/20 text-center">{t('sub_authRequiredDesc')}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-components ──────────────────────────────────────

function PlanCard({ label, price, badge, selected, onClick }: {
  label: string; price: string; badge?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
        selected
          ? 'border-amber-400/50 bg-amber-400/5'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 text-[10px] font-black bg-amber-500 text-deep-navy px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <p className="text-xs text-white/50 font-bold mb-1">{label}</p>
      <p className={`text-lg font-black ${selected ? 'text-amber-400' : 'text-white/70'}`}>{price}</p>
      {selected && (
        <div className="absolute top-3 left-3">
          <Check size={14} className="text-amber-400" />
        </div>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
    />
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Upgrade Prompt (used when free limit reached) ───────

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradePrompt({ isOpen, onClose, onUpgrade }: UpgradePromptProps) {
  const t = useT();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a1628] w-[420px] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center border border-amber-400/20 mx-auto mb-4">
                  <Crown size={32} className="text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{t('sub_limitReached')}</h3>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">{t('sub_limitDesc')}</p>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white/50 bg-white/[0.04] hover:bg-white/[0.08] transition-all border border-white/[0.06]"
                  >
                    {t('close')}
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onUpgrade}
                    className="flex-1 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-deep-navy shadow-[0_3px_0_#92400e] active:shadow-none active:translate-y-[3px] flex items-center justify-center gap-2"
                  >
                    <Crown size={14} />
                    {t('sub_upgrade')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
