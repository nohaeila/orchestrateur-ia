const { ipcMain } = require('electron')
const { lancerAgent, arreterAgent, envoyerMessage } = require('./agentManager')
const { chargerConfigs, sauvegarderConfig, supprimerConfig } = require('./fileService')

// Reçoit les appels de React ("lance cet agent") et les redirige vers le bon fichier (agentManager ou fileService).

function setupIpcHandlers(mainWindow) {
  const notifierReact = (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('agent:update', data)
    }
  }

  ipcMain.handle('agent:lancer', async (_, config) => lancerAgent(config, notifierReact))
  ipcMain.handle('agent:arreter', async (_, id) => arreterAgent(id, notifierReact))
  ipcMain.handle('config:charger', async () => chargerConfigs())
  ipcMain.handle('config:sauvegarder', async (_, cfg) => sauvegarderConfig(cfg))
  ipcMain.handle('config:supprimer', async (_, nom) => supprimerConfig(nom))
}

module.exports = { setupIpcHandlers }