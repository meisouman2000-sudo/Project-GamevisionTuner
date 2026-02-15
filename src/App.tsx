import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameCard } from './components/GameCard'
import { SettingsModal } from './components/SettingsModal'
import { TitleBar } from './components/TitleBar'
import { Plus, Search, Monitor, Sliders } from 'lucide-react'

interface Game {
  id: string;
  title: string;
  installDir: string;
  lastPlayed?: number;
}

function App() {
  const [allGames, setAllGames] = useState<Game[]>([]); // Store all fetched games
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]); // Games shown in grid
  const [loading, setLoading] = useState(true);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* State for profile being edited */
  const [currentProfile, setCurrentProfile] = useState<any>(null);

  /* State for launching feedback to prevent double-clicks */
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);

  useEffect(() => {
    // Load games from Electron API
    const loadGames = async () => {
      try {
        if (window.gameVisionAPI) {
          const [gamesResult, activeGamesIds] = await Promise.all([
            window.gameVisionAPI.scanSteamLibrary(),
            window.gameVisionAPI.getActiveGames()
          ]);

          console.log("Loaded Games:", gamesResult);
          console.log("Active Games:", activeGamesIds);

          let visibleGames: Game[] = [];

          // FIRST RUN: No whitelist exists -> Initialize with TOP 5
          if (!activeGamesIds) {
            console.log("First Run: Initializing Top 5 as Active Whitelist");
            // Sort by LastPlayed Descending
            gamesResult.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
            visibleGames = gamesResult.slice(0, 5);

            // Persist this initial set
            const initialIds = visibleGames.map(g => g.id);
            await window.gameVisionAPI.updateActiveGames(initialIds);
          }
          // SUBSEQUENT RUNS: Use Whitelist
          else {
            // Filter AllGames to only include those in Active List
            visibleGames = gamesResult.filter(g => activeGamesIds.includes(g.id));

            // Sort by LastPlayed (user preference: "displayed first")
            visibleGames.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
          }

          setAllGames(gamesResult);
          setDisplayedGames(visibleGames);

        } else {
          // Mock data for browser testing
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
          setDisplayedGames(mockGames.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
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
          alert(`Failed to launch game: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Launch error:", error);
        alert("Failed to launch game. Check console for details.");
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
    }
  }

  const handleRestoreDefaults = async () => {
    if (window.gameVisionAPI) {
      await window.gameVisionAPI.restoreDefaultSettings();
      // Ideally we would also clear the visual state if the UI reflected global settings
      alert("Display settings restored to default.");
    }
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
    if (!displayedGames.find(g => g.id === game.id)) {
      const newDisplayed = [...displayedGames, game];

      // Sort again? User wants sorted.
      newDisplayed.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));

      setDisplayedGames(newDisplayed);

      setIsAddModalOpen(false);

      // Persist to Whitelist
      if (window.gameVisionAPI) {
        const activeIds = newDisplayed.map(g => g.id);
        await window.gameVisionAPI.updateActiveGames(activeIds);
      }
    }
  }

  // Games available to add (not currently displayed)
  const availableGames = useMemo(() => {
    // Filter out games that are already displayed
    return allGames.filter(g => !displayedGames.find(d => d.id === g.id))
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allGames, displayedGames, searchQuery]);

  const handlePreview = async (profile: any) => {
    if (window.gameVisionAPI) {
      await window.gameVisionAPI.applySettings(profile);
    }
  }

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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestoreDefaults}
            className="flex items-center gap-2 bg-[#ff0055] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_0_#990033] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#ff1a66]"
          >
            <span className="text-xl">🏠</span> RESET TO DEFAULT
          </motion.button>
        </header>

        {/* Library Header */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">LIBRARY</h2>
          <div className="h-1 flex-1 bg-white/10 rounded-full ml-4" />
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
          {loading ? (
            <div className="col-span-full h-64 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-12 h-12 border-4 border-electric-cyan border-t-transparent rounded-full"
                />
                <p className="text-electric-cyan font-bold tracking-widest animate-pulse">SCANNING MAINFRAME...</p>
              </div>
            </div>
          ) : (
            <>
              {displayedGames.map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  profileName={currentProfile ? "Custom" : undefined}
                  isLaunching={launchingGameId === game.id}
                  onPlay={() => handlePlay(game.id)}
                  onSettings={() => handleSettings(game.id)}
                  onRemove={() => handleRemoveGame(game.id)}
                />
              ))}

              {/* Add Game Card */}
              <motion.button
                layout
                onClick={() => setIsAddModalOpen(true)}
                className="group relative bg-[#112240]/50 border-4 border-dashed border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 hover:bg-[#112240] hover:border-electric-cyan/50 transition-all cursor-pointer shadow-none hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] aspect-[4/5] md:aspect-auto md:h-full min-h-[250px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-electric-cyan/20 transition-colors">
                  <Plus size={32} className="text-white/30 group-hover:text-electric-cyan" />
                </div>
                <span className="font-bold text-white/30 group-hover:text-white uppercase tracking-wider">Add Game</span>
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
                    <h3 className="text-xl font-bold text-white mb-4">Add Game to Library</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                      <input
                        type="text"
                        placeholder="Search your library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#112240] text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-electric-cyan/50 placeholder:text-white/20 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {availableGames.length === 0 ? (
                      <div className="text-center py-10 text-white/30">
                        No matching games found.
                      </div>
                    ) : (
                      availableGames.map(game => (
                        <div key={game.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                          <div className="relative w-32 h-[48px] shrink-0 rounded-lg overflow-hidden bg-[#0a1628] shadow-md border border-white/5">
                            {/* Placeholder/Bg for transparency */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] to-[#1a365d]" />
                            <img
                              src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/header.jpg`} // Use header.jpg instead of capsule for better aspect ratio compatibility or keep capsule? Capsule is 120x45 usually.
                              // Actually capsule_sm_120 is 120x45. 
                              alt={game.title}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1" fill="%231a365d"/></svg>' }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">
                              {game.title}
                              {displayedGames.find(d => d.id === game.id) && <span className="ml-2 text-xs text-electric-cyan">(Added)</span>}
                            </h4>
                            <p className="text-xs text-white/40">Last Played: {game.lastPlayed ? new Date(game.lastPlayed * 1000).toLocaleDateString() : 'Never'}</p>
                          </div>
                          <button
                            onClick={() => handleAddGame(game)}
                            className="bg-electric-cyan text-deep-navy px-4 py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                          >
                            ADD
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-white/5 bg-[#0d1b2a] flex justify-end">
                    <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white font-bold px-4 py-2">Close</button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
