import { app, BrowserWindow, shell } from 'electron'
import { join } from 'node:path'

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // << .js is what electron-vite emits
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    await win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    await win.loadFile(join(__dirname, '../renderer/index.html')) // << matches out/renderer
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // comment out for release if you like
  // win.webContents.openDevTools({ mode: 'detach' })
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