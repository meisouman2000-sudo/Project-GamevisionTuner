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
  applySettings: (profile: any) => ipcRenderer.invoke('apply-settings', profile),
  launchGame: (gameId: string, installDir?: string) => ipcRenderer.invoke('launch-game', gameId, installDir),
  restoreDefaultSettings: () => ipcRenderer.invoke('restore-default-settings'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getActiveGames: () => ipcRenderer.invoke('get-active-games'),
  updateActiveGames: (gameIds: string[]) => ipcRenderer.invoke('update-active-games', gameIds),
})
