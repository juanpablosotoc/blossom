// src/index.ts
import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'


async function createWindow() {
  const win = new BrowserWindow({
    
    width: 1200,
    height: 800,
    webPreferences: {
    // frame: false, // Makes the window borderless
    // transparent: true, // Allows transparency
    // hasShadow: false, // Removes window shadow
    // resizable: false, // Makes the window non-resizable
    // skipTaskbar: true, // Hides the window from the taskbar
      // electron-vite builds your preload to out/preload/index.mjs
      // (dev maps automatically, prod path below works after build)
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    // dev (served by Vite)
    await win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    // prod (built HTML)
    await win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  win.webContents.openDevTools({ mode: 'detach' });
  
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})