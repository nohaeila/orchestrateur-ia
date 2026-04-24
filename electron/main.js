require('dotenv').config()

const { app, BrowserWindow } = require('electron')
const path = require('path')
const { setupIpcHandlers } = require('./ipcHandlers')

let mainWindow

function createWindow() {
  console.log("CREATE WINDOW")

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const isDev = true
  console.log("IS DEV =", isDev)

  if (isDev) {
    console.log("LOAD VITE")
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    console.log("LOAD DIST")
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.webContents.on('did-fail-load', (e, code, desc) => {
    console.error("FAIL LOAD:", desc)
  })

  mainWindow.on('closed', () => {
    console.log("WINDOW CLOSED")
  })
}

app.whenReady().then(() => {
  console.log("APP READY")
  createWindow()
  setupIpcHandlers(mainWindow) // ← c'était manquant !
})

app.on('window-all-closed', () => {
  console.log("ALL WINDOWS CLOSED")
  if (process.platform !== 'darwin') app.quit()
})