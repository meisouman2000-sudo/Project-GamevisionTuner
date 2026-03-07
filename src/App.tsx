import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameCard } from './components/GameCard'
import { SettingsModal } from './components/SettingsModal'
import { TitleBar } from './components/TitleBar'
import { HelpTooltip } from './components/HelpTooltip'
import { SubscriptionModal, UpgradePrompt } from './components/SubscriptionModal'
import { LanguageProvider, useLanguage, useT } from './i18n-context'
import { Plus, Search, Monitor, Sliders, Globe, Gamepad2, Crown, Sparkles } from 'lucide-react'

interface Game {
  id: string;
  title: string;
  installDir: string;
  lastPlayed?: number;
}

function AppContent() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);

  // Track which games have saved profiles (gameId → true)
  const [savedProfileIds, setSavedProfileIds] = useState<Set<string>>(new Set());

  // Subscription state
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    active: boolean;
    licenseKey: string | null;
    plan: 'free' | 'pro';
    expiresAt: string | null;
  }>({ active: false, licenseKey: null, plan: 'free', expiresAt: null });
  const [gameLimit, setGameLimit] = useState(1);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isUpgradePromptOpen, setIsUpgradePromptOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const t = useT();

  const loadSubscriptionStatus = useCallback(async () => {
    if (!window.gameVisionAPI?.getSubscriptionStatus) return;
    const [status, limit] = await Promise.all([
      window.gameVisionAPI.getSubscriptionStatus(),
      window.gameVisionAPI.getGameLimit(),
    ]);
    setSubscriptionStatus(status);
    setGameLimit(limit === Infinity ? Infinity : (limit as number));
  }, []);

  const refreshSavedProfiles = useCallback(async (games: Game[]) => {
    if (!window.gameVisionAPI?.getSavedProfileIds) return;
    const gameIds = games.map(g => g.id);
    const ids = await window.gameVisionAPI.getSavedProfileIds(gameIds);
    setSavedProfileIds(new Set(ids));
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      try {
        if (window.gameVisionAPI) {
          const [gamesResult, activeGamesIds] = await Promise.all([
            window.gameVisionAPI.scanSteamLibrary(),
            window.gameVisionAPI.getActiveGames(),
          ]);

          let visibleGames: Game[] = [];

          if (!activeGamesIds) {
            // First run: empty library — user must add games manually
            visibleGames = [];
            await window.gameVisionAPI.updateActiveGames([]);
          } else {
            visibleGames = gamesResult.filter((g: Game) => activeGamesIds.includes(g.id));
            visibleGames.sort((a: Game, b: Game) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
          }

          setAllGames(gamesResult);
          setDisplayedGames(visibleGames);

          await loadSubscriptionStatus();
          await refreshSavedProfiles(visibleGames);
        } else {
          console.warn("Electron API not found, using mocks");
          await new Promise(r => setTimeout(r, 1000));
          const mockGames = [
            { id: '1172470', title: 'Apex Legends', installDir: '', lastPlayed: 1000 },
            { id: '413150', title: 'Stardew Valley', installDir: '', lastPlayed: 900 },
            { id: '730', title: 'Counter-Strike 2', installDir: '', lastPlayed: 800 },
            { id: '1085660', title: 'Destiny 2', installDir: '', lastPlayed: 700 },
            { id: '570', title: 'Dota 2', installDir: '', lastPlayed: 600 },
            { id: '440', title: 'Team Fortress 2', installDir: '', lastPlayed: 500 },
          ];
          setAllGames(mockGames);
          setDisplayedGames([]);
        }
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, [loadSubscriptionStatus, refreshSavedProfiles]);

  // Listen for periodic Steam library updates — only update the "available" pool, NOT auto-add
  useEffect(() => {
    if (!window.gameVisionAPI?.onSteamLibraryUpdated) return;

    const cleanup = window.gameVisionAPI.onSteamLibraryUpdated((updatedGames: Game[]) => {
      console.log('[Renderer] Steam library updated, new game count:', updatedGames.length);
      setAllGames([...updatedGames]);
    });

    return cleanup;
  }, []);

  const handlePlay = async (gameId: string) => {
    if (launchingGameId) return; // Prevent double click

    console.log("Playing", gameId);
    setLaunchingGameId(gameId);

    // Min wait time for UI feedback
    const minWait = new Promise(r => setTimeout(r, 1500));

    if (window.gameVisionAPI) {
      try {
        // Find game for installDir
        const game = allGames.find(g => g.id === gameId);

        // 1. Load Profile
        const profile = await window.gameVisionAPI.loadProfile(gameId);

        // 2. Apply Settings (if profile exists)
        if (profile) {
          console.log("Applying game profile:", profile);
          await window.gameVisionAPI.applySettings(profile);
        } else {
          console.log("No profile found, proceeding with current/default settings.");
        }

        // 3. Launch Game (pass installDir for auto-restore monitoring)
        const result = await window.gameVisionAPI.launchGame(gameId, game?.installDir);
        if (result && !result.success) {
          alert(`${t('launchFailed')}: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Launch error:", error);
        alert(t('launchFailed'));
      }
    }

    await minWait;
    setLaunchingGameId(null);
  }

  const handleSettings = async (gameId: string) => {
    console.log("Settings", gameId);
    setEditingGameId(gameId);
    if (window.gameVisionAPI) {
      const profile = await window.gameVisionAPI.loadProfile(gameId);
      setCurrentProfile(profile);
    } else {
      setCurrentProfile(null);
    }
  }

  const handleSaveProfile = async (gameId: string, profile: any) => {
    console.log("Saving Profile", gameId, profile);
    if (window.gameVisionAPI) {
      await window.gameVisionAPI.saveProfile(gameId, profile);
      setSavedProfileIds(prev => new Set([...prev, gameId]));
    }
  }

  const handleResetGameToDefault = async (gameId: string) => {
    if (!window.gameVisionAPI?.clearGameProfile || !window.gameVisionAPI?.restoreDisplayToDefault) return;
    await window.gameVisionAPI.clearGameProfile(gameId);
    await window.gameVisionAPI.restoreDisplayToDefault();
    setCurrentProfile(null);
    setSavedProfileIds(prev => {
      const next = new Set(prev);
      next.delete(gameId);
      return next;
    });
    if (editingGameId === gameId) setEditingGameId(null);
    alert(t('settingsRestored'));
  }

  const handleRemoveGame = async (gameId: string) => {
    // 1. Remove from UI immediately (no refill)
    const newDisplayed = displayedGames.filter(g => g.id !== gameId);
    setDisplayedGames(newDisplayed);

    // 2. Persist to Active Games Whitelist
    if (window.gameVisionAPI) {
      const activeIds = newDisplayed.map(g => g.id);
      await window.gameVisionAPI.updateActiveGames(activeIds);
    }
  }

  const handleAddGame = async (game: Game) => {
    if (displayedGames.find(g => g.id === game.id)) return;

    // Free tier limit check
    if (!subscriptionStatus.active && displayedGames.length >= gameLimit) {
      setIsAddModalOpen(false);
      setIsUpgradePromptOpen(true);
      return;
    }

    const newDisplayed = [...displayedGames, game];
    setDisplayedGames(newDisplayed);
    setIsAddModalOpen(false);

    if (window.gameVisionAPI) {
      const activeIds = newDisplayed.map(g => g.id);
      await window.gameVisionAPI.updateActiveGames(activeIds);
    }
  }

  // Games available to add (not currently displayed)
  const availableGames = useMemo(() => {
    // Filter out games that are already displayed
    return allGames.filter(g => !displayedGames.find(d => d.id === g.id))
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allGames, displayedGames, searchQuery]);

  const handlePreview = useCallback(async (profile: any) => {
    if (window.gameVisionAPI) {
      await window.gameVisionAPI.applySettings(profile);
    }
  }, []);

  const handleActivateLicense = async (key: string) => {
    if (!window.gameVisionAPI?.activateLicense) {
      return { success: false, error: 'API not available' };
    }
    const result = await window.gameVisionAPI.activateLicense(key);
    if (result.success) {
      await loadSubscriptionStatus();
    }
    return result;
  };

  const handleDeactivateLicense = async () => {
    if (window.gameVisionAPI?.deactivateLicense) {
      await window.gameVisionAPI.deactivateLicense();
      await loadSubscriptionStatus();
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="h-screen bg-deep-navy text-white overflow-hidden flex flex-col selection:bg-electric-cyan selection:text-deep-navy">
      <TitleBar />
      <div className="flex-1 overflow-y-auto p-8 relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 px-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            {/* Logo: Vector Component for perfect transparency and crispness */}
            <div className="w-24 h-24 flex items-center justify-center relative">
              <Monitor size={80} className="text-electric-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center pt-2">
                <Sliders size={40} className="text-juicy-green drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] bg-deep-navy/20 backdrop-blur-[1px]" strokeWidth={2} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none">
                GAMEVISION <span className="text-electric-cyan">TUNER</span>
              </h1>
              <p className="text-xs text-electric-cyan/70 font-bold tracking-[0.3em] uppercase mt-2">NVIDIA Display Optimizer</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <HelpTooltip />

            {/* Subscription Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold border transition-all ${
                subscriptionStatus.active
                  ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/5 text-amber-400 border-amber-400/30 hover:border-amber-400/60'
                  : 'bg-[#112240] text-white/50 border-white/10 hover:border-white/30 hover:text-white/80'
              }`}
            >
              {subscriptionStatus.active ? <Sparkles size={16} /> : <Crown size={16} />}
              <span className="text-sm">{subscriptionStatus.active ? t('sub_pro') : t('sub_free')}</span>
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-[#112240] text-electric-cyan px-4 py-3 rounded-xl font-bold border border-electric-cyan/20 hover:border-electric-cyan/50 transition-all"
            >
              <Globe size={18} />
              <span className="text-sm">{language === 'en' ? 'EN' : 'JA'}</span>
            </motion.button>

          </div>
        </header>

        {/* Library Header */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">{t('library')}</h2>
          <span className="text-xs font-bold text-white/30 bg-white/5 px-2.5 py-1 rounded-full ml-2">
            {displayedGames.length}{!subscriptionStatus.active ? `/${gameLimit}` : ''} {t('sub_gameCount')}
          </span>
          <div className="h-1 flex-1 bg-white/10 rounded-full ml-4" />
        </div>

        {/* Game List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-20">
          {loading ? (
            <div className="col-span-full h-40 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-10 h-10 border-3 border-electric-cyan border-t-transparent rounded-full"
                />
                <p className="text-electric-cyan font-bold tracking-widest animate-pulse text-sm">{t('scanning')}</p>
              </div>
            </div>
          ) : (
            <>
              {displayedGames.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center">
                  <Gamepad2 size={48} className="text-white/10 mb-4" strokeWidth={1} />
                  <p className="text-lg font-bold text-white/30 mb-1">{t('sub_emptyLibrary')}</p>
                  <p className="text-sm text-white/20">{t('sub_emptyLibraryDesc')}</p>
                </div>
              )}

              {displayedGames.map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  profileName={savedProfileIds.has(game.id) ? t('profileConfigured') : undefined}
                  isLaunching={launchingGameId === game.id}
                  onPlay={() => handlePlay(game.id)}
                  onSettings={() => handleSettings(game.id)}
                  onRemove={() => handleRemoveGame(game.id)}
                  onResetToDefault={() => handleResetGameToDefault(game.id)}
                />
              ))}

              {/* Add Game Button */}
              <motion.button
                layout
                onClick={() => {
                  if (!subscriptionStatus.active && displayedGames.length >= gameLimit) {
                    setIsUpgradePromptOpen(true);
                  } else {
                    setIsAddModalOpen(true);
                  }
                }}
                className="group flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 border-dashed border-white/10 hover:border-electric-cyan/40 hover:bg-white/[0.02] transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-electric-cyan/10 transition-colors border border-white/[0.06]">
                  <Plus size={20} className="text-white/30 group-hover:text-electric-cyan" />
                </div>
                <span className="font-bold text-white/30 group-hover:text-white/70 text-sm uppercase tracking-wider">
                  {t('addGame')}
                  {!subscriptionStatus.active && displayedGames.length >= gameLimit && (
                    <Crown size={12} className="inline ml-2 text-amber-400/60" />
                  )}
                </span>
              </motion.button>
            </>
          )}
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={!!editingGameId}
          onClose={() => setEditingGameId(null)}
          gameTitle={displayedGames.find(g => g.id === editingGameId)?.title || ""}
          gameId={editingGameId || ""}
          initialProfile={currentProfile}
          onSave={handleSaveProfile}
          onPreview={handlePreview}
          onResetToDefault={editingGameId ? () => handleResetGameToDefault(editingGameId) : undefined}
        />

        {/* Add Game Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddModalOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              />
              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-deep-navy w-[600px] h-[80vh] rounded-3xl border-4 border-[#1a365d] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                >
                  <div className="p-6 border-b border-white/5 bg-[#0d1b2a]">
                    <h3 className="text-xl font-bold text-white mb-4">{t('addGameToLibrary')}</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                      <input
                        type="text"
                        placeholder={t('searchLibrary')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#112240] text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-electric-cyan/50 placeholder:text-white/20 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {availableGames.length === 0 ? (
                      <div className="text-center py-10 text-white/30">
                        {t('noGamesFound')}
                      </div>
                    ) : (
                      availableGames.map(game => (
                        <div key={game.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                          <div className="relative w-32 h-[48px] shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#0d1b2a] to-[#1a365d] flex items-center justify-center border border-white/5">
                            <Gamepad2 size={20} className="text-electric-cyan/40" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">
                              {game.title}
                              {displayedGames.find(d => d.id === game.id) && <span className="ml-2 text-xs text-electric-cyan">{t('added')}</span>}
                            </h4>
                            <p className="text-xs text-white/40">{t('lastPlayed')}: {game.lastPlayed ? new Date(game.lastPlayed * 1000).toLocaleDateString() : t('never')}</p>
                          </div>
                          <button
                            onClick={() => handleAddGame(game)}
                            className="bg-electric-cyan text-deep-navy px-4 py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                          >
                            {t('add')}
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-white/5 bg-[#0d1b2a] flex justify-end">
                    <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white font-bold px-4 py-2">{t('close')}</button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={isSubModalOpen}
          onClose={() => setIsSubModalOpen(false)}
          subscriptionStatus={subscriptionStatus}
          onActivate={handleActivateLicense}
          onDeactivate={handleDeactivateLicense}
        />

        {/* Upgrade Prompt */}
        <UpgradePrompt
          isOpen={isUpgradePromptOpen}
          onClose={() => setIsUpgradePromptOpen(false)}
          onUpgrade={() => {
            setIsUpgradePromptOpen(false);
            setIsSubModalOpen(true);
          }}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App
