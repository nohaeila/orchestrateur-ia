const { ipcMain } = require('electron')
const { lancerAgent, arreterAgent } = require('./agentManager')
const { chargerConfigs, sauvegarderConfig, supprimerConfig } = require('./fileService')

function setupIpcHandlers(mainWindow) {
  const notifierReact = (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('agent:update', data)
    }
  }

  // Routes de base pour le début du projet
  ipcMain.handle('agent:lancer', async (_, config) => lancerAgent(config, notifierReact))
  ipcMain.handle('agent:arreter', async (_, id) => arreterAgent(id, notifierReact))
  ipcMain.handle('config:charger', async () => chargerConfigs())
  ipcMain.handle('config:sauvegarder', async (_, cfg) => sauvegarderConfig(cfg))
  ipcMain.handle('config:supprimer', async (_, nom) => supprimerConfig(nom))
  
}

module.exports = { setupIpcHandlers }