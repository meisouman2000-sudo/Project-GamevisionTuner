import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('gameVisionAPI', {
  scanSteamLibrary: () => ipcRenderer.invoke('scan-steam-library'),
  saveProfile: (gameId: string, profile: any) => ipcRenderer.invoke('save-profile', gameId, profile),
  loadProfile: (gameId: string) => ipcRenderer.invoke('load-profile', gameId),
  getSavedProfileIds: (gameIds: string[]) => ipcRenderer.invoke('get-saved-profile-ids', gameIds),
  applySettings: (profile: any) => ipcRenderer.invoke('apply-settings', profile),
  launchGame: (gameId: string, installDir?: string) => ipcRenderer.invoke('launch-game', gameId, installDir),
  clearGameProfile: (gameId: string) => ipcRenderer.invoke('clear-game-profile', gameId),
  restoreDisplayToDefault: () => ipcRenderer.invoke('restore-display-to-default'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getActiveGames: () => ipcRenderer.invoke('get-active-games'),
  updateActiveGames: (gameIds: string[]) => ipcRenderer.invoke('update-active-games', gameIds),
  onSteamLibraryUpdated: (callback: (games: any[]) => void) => {
    const handler = (_event: any, games: any[]) => callback(games);
    ipcRenderer.on('steam-library-updated', handler);
    // Return cleanup function
    return () => ipcRenderer.removeListener('steam-library-updated', handler);
  },
  getLanguage: () => ipcRenderer.invoke('get-language'),
  setLanguage: (lang: string) => ipcRenderer.invoke('set-language', lang),

  // Auth + Subscription
  getAuthState: () => ipcRenderer.invoke('get-auth-state'),
  getGameLimit: (plan: string) => ipcRenderer.invoke('get-game-limit', plan),
  signInWithGoogle: () => ipcRenderer.invoke('sign-in-with-google'),
  signOut: () => ipcRenderer.invoke('sign-out'),
  createCheckoutSession: (interval: string) => ipcRenderer.invoke('create-checkout-session', interval),
  createPortalSession: () => ipcRenderer.invoke('create-portal-session'),
  openExternalUrl: (url: string) => ipcRenderer.invoke('open-external-url', url),
})
