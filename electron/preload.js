const { contextBridge, ipcRenderer } = require('electron')

// On expose les méthodes au monde de React (window.electronAPI)
contextBridge.exposeInMainWorld('electronAPI', {
  // Configs
  chargerConfigs: () => ipcRenderer.invoke('config:charger'),
  sauvegarderConfig: (config) => ipcRenderer.invoke('config:sauvegarder', config),
  supprimerConfig: (nomFichier) => ipcRenderer.invoke('config:supprimer', nomFichier),
  
  // Agents
  lancerAgent: (config) => ipcRenderer.invoke('agent:lancer', config),
  arreterAgent: (id) => ipcRenderer.invoke('agent:arreter', id),
  getAgentsActifs: () => ipcRenderer.invoke('agent:getAll'),
  
  // Logs & Events
  getLogs: () => ipcRenderer.invoke('logs:get'),
  onAgentUpdate: (callback) => ipcRenderer.on('agent:update', (event, data) => callback(data)),
  removeAgentUpdate: () => ipcRenderer.removeAllListeners('agent:update')
})