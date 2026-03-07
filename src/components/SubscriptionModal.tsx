import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Key, CheckCircle, AlertCircle, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useT } from '../i18n-context';

interface SubscriptionStatus {
  active: boolean;
  licenseKey: string | null;
  plan: 'free' | 'pro';
  expiresAt: string | null;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionStatus: SubscriptionStatus;
  onActivate: (key: string) => Promise<{ success: boolean; error?: string }>;
  onDeactivate: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  subscriptionStatus,
  onActivate,
  onDeactivate,
}: SubscriptionModalProps) {
  const t = useT();
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleActivate = async () => {
    if (!licenseKey.trim()) return;

    setIsActivating(true);
    setError(null);
    setSuccess(false);

    const result = await onActivate(licenseKey.trim().toUpperCase());

    if (result.success) {
      setSuccess(true);
      setLicenseKey('');
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error || t('sub_invalidKey'));
    }

    setIsActivating(false);
  };

  const handleDeactivate = () => {
    if (window.confirm(t('sub_deactivateConfirm'))) {
      onDeactivate();
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isActivating) {
      handleActivate();
    }
  };

  const maskedKey = subscriptionStatus.licenseKey
    ? subscriptionStatus.licenseKey.slice(0, 8) + '••••-••••-••••'
    : '';

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
              className="bg-[#0a1628] w-[480px] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden pointer-events-auto"
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
                    <h2 className="text-xl font-black text-white">{t('sub_status')}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      {subscriptionStatus.active ? (
                        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> {t('sub_pro')}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                          {t('sub_free')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                {subscriptionStatus.active ? (
                  /* Active Pro View */
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-500/5 to-amber-900/5 border border-amber-500/10 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-amber-300">{t('sub_proPlan')}</p>
                          <p className="text-xs text-white/50 mt-1">{t('sub_proDesc')}</p>
                          {subscriptionStatus.expiresAt && (
                            <p className="text-xs text-white/30 mt-2">
                              {t('sub_expiresAt')}: {new Date(subscriptionStatus.expiresAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                      <p className="text-xs text-white/30 font-mono">{maskedKey}</p>
                    </div>

                    <button
                      onClick={handleDeactivate}
                      className="w-full text-sm text-red-400/60 hover:text-red-400 py-2 transition-colors"
                    >
                      {t('sub_deactivate')}
                    </button>
                  </div>
                ) : (
                  /* Free Plan — Activation View */
                  <div className="space-y-4">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                      <p className="text-sm text-white/60">{t('sub_freeDesc')}</p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">
                        <Key size={12} className="inline mr-1.5 -mt-0.5" />
                        {t('sub_enterKey')}
                      </label>
                      <input
                        type="text"
                        value={licenseKey}
                        onChange={(e) => {
                          setLicenseKey(e.target.value);
                          setError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t('sub_keyPlaceholder')}
                        className="w-full bg-[#112240] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400/30 placeholder:text-white/15 font-mono text-sm border border-white/[0.06]"
                        disabled={isActivating}
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

                    {/* Success */}
                    <AnimatePresence>
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10"
                        >
                          <CheckCircle size={14} className="shrink-0" />
                          <span>{t('sub_activated')}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleActivate}
                      disabled={isActivating || !licenseKey.trim()}
                      className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
                        ${isActivating || !licenseKey.trim()
                          ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-deep-navy shadow-[0_4px_0_#92400e] active:shadow-none active:translate-y-[4px] hover:from-amber-400 hover:to-amber-500'
                        }`}
                    >
                      {isActivating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-deep-navy/30 border-t-deep-navy rounded-full"
                          />
                          {t('sub_activating')}
                        </>
                      ) : (
                        <>
                          <Crown size={16} />
                          {t('sub_activate')}
                        </>
                      )}
                    </motion.button>
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
