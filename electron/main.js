const { app, BrowserWindow, ipcMain, Tray, Notification } = require('electron')
const path = require('path')
const { setupIpcHandlers } = require('./ipcHandlers')

let mainWindow
let tray

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Orchestrateur IA',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // sécurité : React ne peut pas appeler Node directement
      nodeIntegration: false    // sécurité : idem
    }
  })

  // En dev on charge Vite, en prod on charge le build
  const isDev = !app.isPackaged
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  setupIpcHandlers(mainWindow) // on branche tous les canaux IPC
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
