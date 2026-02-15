import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Store from 'electron-store'
import { scanSteamGames } from './steam'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Initialize store
const store = new Store();

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden', // Custom title bar for "Toy" feel? Or just standard for now.
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// IPC Handlers
// IPC Handlers
ipcMain.handle('scan-steam-library', async () => {
  try {
    return await scanSteamGames();
  } catch (e) {
    console.error('Scan failed', e);
    return [];
  }
})

ipcMain.handle('save-profile', async (_event, gameId, profile) => {
  store.set(`profiles.${gameId}`, profile);
  return true;
})

ipcMain.handle('load-profile', async (_event, gameId) => {
  return store.get(`profiles.${gameId}`, null);
})

ipcMain.handle('apply-settings', async (_event, profile) => {
  console.log('Applying settings:', profile);

  // Resolve path to DisplayTuner.exe
  // In dev: ./backend/DisplayTuner.exe
  // In prod: resources/backend/DisplayTuner.exe (need to configure builder)

  let tunerPath;
  if (app.isPackaged) {
    tunerPath = path.join(process.resourcesPath, 'backend', 'DisplayTuner.exe');
  } else {
    tunerPath = path.join(__dirname, '..', 'backend', 'DisplayTuner.exe');
  }

  const { brightness, contrast, gamma, digitalVibrance } = profile;

  // Spawn
  const { execFile } = await import('child_process');

  // Map arguments
  // Vibrance is 0-100 in UI. DisplayTuner takes 0-100? Yes.
  // Brightness 0-100.
  // Gamma 0.5-2.5.
  // Contrast 0-100.

  const args = [
    '--brightness', brightness.toString(),
    '--contrast', contrast.toString(),
    '--gamma', (gamma / 100).toString(),
    '--vibrance', digitalVibrance.toString()
  ];

  console.log(`Running: ${tunerPath} ${args.join(' ')}`);

  execFile(tunerPath, args, (error, stdout, stderr) => {
    if (error) {
      console.error(`DisplayTuner error: ${error.message}`);
      console.error(stderr);
      return;
    }
    console.log(`DisplayTuner output: ${stdout}`);
  });

  return true;
})

ipcMain.handle('launch-game', async (_event, gameId) => {
  console.log(`Launching game: steam://run/${gameId}`);
  try {
    const url = `steam://run/${gameId}`;
    await shell.openExternal(url);

    // Start Monitoring -> Now handled globally!
    // monitorGameProcess(gameId);

    return { success: true };
  } catch (error) {
    console.error(`Failed to launch game ${gameId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
})

// Registry Monitor (Steam)
// import { exec } from 'child_process'; // Removed in favor of execFile
// Global Monitor State
// let _globalMonitorInterval: NodeJS.Timeout | null = null;
let lastRunningInfo = { id: 0, startTime: 0 };

function startGlobalGameMonitor() {
  console.log('[Monitor] Starting Global Steam Registry Monitor...');

  // Set Auto-Start
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe'),
  });

  // Use execFile 'reg' directly to avoid spawning cmd.exe shell instance every second.
  // This reduces process noise in Task Manager.
  const { execFile } = require('child_process');

  // Polling Interval: 2s (Less aggressive)
  setInterval(() => {
    execFile('reg', ['query', 'HKCU\\Software\\Valve\\Steam', '/v', 'RunningAppID'], (err: any, stdout: string) => {
      // If error (e.g. key missing), just ignore this tick. 
      // Do NOT assume ID=0 unless we are sure. 
      // Actually, if key is missing, Steam might not be running or no game.
      if (err) return;

      let currentId = 0;
      if (stdout) {
        const match = stdout.match(/0x([0-9a-fA-F]+)/);
        if (match) {
          currentId = parseInt(match[1], 16);
        }
      }

      // State Change Detection
      if (currentId !== lastRunningInfo.id) {
        console.log(`[Monitor] Game State Changed: ${lastRunningInfo.id} -> ${currentId}`);

        // CASE A: Game Started
        if (currentId !== 0) {
          console.log(`[Monitor] New Game Detected: ${currentId}`);

          const profile = store.get(`profiles.${currentId}`, null);
          if (profile) {
            console.log(`[Monitor] Found profile for ${currentId}, applying...`);
            applySettingsBackend(profile);
          } else {
            console.log(`[Monitor] No profile for ${currentId}.`);
          }
        }

        // CASE B: Game Exited
        else if (currentId === 0) {
          if (lastRunningInfo.id !== 0) {
            console.log(`[Monitor] Game Exited. Restoring defaults.`);
            restoreDefaultsBackend();
          }
        }

        lastRunningInfo.id = currentId;
      }
    });
  }, 2000);
}

// Helper to apply settings from backend (detached from IPC event)
async function applySettingsBackend(profile: any) {
  let tunerPath;
  if (app.isPackaged) {
    tunerPath = path.join(process.resourcesPath, 'backend', 'DisplayTuner.exe');
  } else {
    tunerPath = path.join(__dirname, '..', 'backend', 'DisplayTuner.exe');
  }

  const { brightness, contrast, gamma, digitalVibrance } = profile;
  const args = [
    '--brightness', brightness.toString(),
    '--contrast', contrast.toString(),
    '--gamma', (gamma / 100).toString(),
    '--vibrance', digitalVibrance.toString()
  ];

  console.log(`[Backend] Applying: ${args.join(' ')}`);

  // We need execFile from child_process
  // Since we are inside a function, we can import or use global if available.
  // 'exec' is already imported. 'execFile' needs import.
  const { execFile } = await import('child_process');

  execFile(tunerPath, args, (error, stdout, _stderr) => {
    if (error) {
      console.error(`[Backend] DisplayTuner error: ${error.message}`);
    } else {
      console.log(`[Backend] DisplayTuner output: ${stdout}`);
    }
  });
}

// Snapshotted Default Settings
let globalDefaultSettings = {
  brightness: 50,
  contrast: 50,
  gamma: 1.0,
  digitalVibrance: 50
};

async function snapshotCurrentSettings() {
  console.log('[Backend] Snapshotting current settings...');
  let tunerPath;
  if (app.isPackaged) {
    tunerPath = path.join(process.resourcesPath, 'backend', 'DisplayTuner.exe');
  } else {
    tunerPath = path.join(__dirname, '..', 'backend', 'DisplayTuner.exe');
  }

  const { execFile } = await import('child_process');

  return new Promise<void>((resolve) => {
    execFile(tunerPath, ['--read'], (error, stdout, _stderr) => {
      if (!error && stdout) {
        try {
          // Output format: { "brightness": 50, ... }
          // Or log lines + JSON. Find the JSON line.
          const match = stdout.match(/\{.*\}/);
          if (match) {
            const data = JSON.parse(match[0]);
            globalDefaultSettings = {
              brightness: data.brightness,
              contrast: data.contrast,
              gamma: data.gamma,
              digitalVibrance: data.vibrance
            };
            console.log('[Backend] Snapshotted Defaults:', globalDefaultSettings);
          }
        } catch (e) {
          console.error('[Backend] Failed to parse snapshot:', e);
        }
      } else {
        console.warn('[Backend] Snapshot failed, using hardcoded defaults.');
      }
      resolve();
    });
  });
}

async function restoreDefaultsBackend() {
  let tunerPath;
  if (app.isPackaged) {
    tunerPath = path.join(process.resourcesPath, 'backend', 'DisplayTuner.exe');
  } else {
    tunerPath = path.join(__dirname, '..', 'backend', 'DisplayTuner.exe');
  }

  const { brightness, contrast, gamma, digitalVibrance } = globalDefaultSettings;
  console.log(`[Backend] Restoring Defaults: Bri=${brightness} Con=${contrast} Gam=${gamma} Vib=${digitalVibrance}`);

  const args = [
    '--brightness', brightness.toString(),
    '--contrast', contrast.toString(),
    '--gamma', (gamma).toString(), // CLI expects 1.0, snapshot has 1.0
    '--vibrance', digitalVibrance.toString()
  ];

  const { execFile } = await import('child_process');
  execFile(tunerPath, args, (error, stdout, _stderr) => {
    if (error) console.error("Failed to restore defaults:", error);
    else console.log("Defaults restored automatically:", stdout);
  });
}

ipcMain.handle('minimize-window', () => {
  win?.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});

ipcMain.handle('close-window', () => {
  win?.close();
});

ipcMain.handle('restore-default-settings', async () => {
  console.log('Restoring default settings');
  store.clear();
  return;
})

ipcMain.handle('get-active-games', async () => {
  return store.get('activeGames', null); // Returns null if never set
})

ipcMain.handle('update-active-games', async (_event, gameIds: string[]) => {
  store.set('activeGames', gameIds);
  return true;
})

ipcMain.handle('clear-active-games', async () => {
  store.delete('activeGames');
  return true;
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('before-quit', async (e) => {
  // If a game was running (or we just want to be safe), restore defaults!
  // Note: execFile is async. quitting might kill it.
  // We should try to run synchronously or prevent quit until done?
  // Electron synchronous exec is bad basically, but we can try spawnSync or just fire and hope.
  // Better: e.preventDefault(), run restore, then app.exit().

  if (lastRunningInfo.id !== 0) {
    console.log("[App] Quitting while game active! Restoring defaults...");
    e.preventDefault();

    // Quick restore logic (fire and forget might be too fast)
    await restoreDefaultsBackend();

    // Reset ID so we don't loop
    lastRunningInfo.id = 0;

    setTimeout(() => {
      console.log("[App] Exiting now.");
      app.exit(0);
    }, 1000); // Give 1s for DisplayTuner to run
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Fix for blurry text on some Windows high-DPI setups
// app.commandLine.appendSwitch('high-dpi-support', '1');
// app.commandLine.appendSwitch('force-device-scale-factor', '1'); <--- This caused the extreme blur!

app.whenReady().then(async () => {
  await snapshotCurrentSettings();
  createWindow();
  startGlobalGameMonitor();
})
