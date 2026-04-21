import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import ConfigPanel from './components/ConfigPanel'
import './index.css'

export default function App() {
  const [vue, setVue] = useState('dashboard') 
  const [agentsActifs, setAgentsActifs] = useState([])
  const [configs, setConfigs] = useState([])

  useEffect(() => {
    window.electronAPI.chargerConfigs().then(setConfigs)
  }, [])

  useEffect(() => {
    window.electronAPI.onAgentUpdate((update) => {
      setAgentsActifs(prev =>
        prev.map(a =>
          a.id === update.agentId ? { ...a, status: update.status } : a
        ).filter(a => a.status !== 'arrete')
      )
    })
    return () => window.electronAPI.removeAgentUpdate()
  }, [])

  async function lancerAgent(config) {
    setAgentsActifs(prev => [...prev, { ...config, status: 'en_cours', startedAt: new Date().toISOString() }])
    await window.electronAPI.lancerAgent(config)
  }

  async function arreterAgent(agentId) {
    await window.electronAPI.arreterAgent(agentId)
  }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo"> Orchestrateur IA</div>
        <button className={vue === 'dashboard' ? 'active' : ''} onClick={() => setVue('dashboard')}>
           Dashboard
        </button>
        <button className={vue === 'config' ? 'active' : ''} onClick={() => setVue('config')}>
           Configurations
        </button>
      </nav>

      <main className="content">
        {vue === 'dashboard' && (
          <Dashboard
            agentsActifs={agentsActifs}
            configs={configs}
            onLancer={lancerAgent}
            onArreter={arreterAgent}
          />
        )}
        {vue === 'config' && (
          <ConfigPanel
            configs={configs}
            onSauvegarder={async (cfg) => {
              await window.electronAPI.sauvegarderConfig(cfg)
              const updated = await window.electronAPI.chargerConfigs()
              setConfigs(updated)
            }}
            onSupprimer={async (nom) => {
              await window.electronAPI.supprimerConfig(nom)
              const updated = await window.electronAPI.chargerConfigs()
              setConfigs(updated)
            }}
          />
        )}
      </main>
    </div>
  )
}