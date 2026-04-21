import { useState } from 'react'

// Formulaire pour créer / supprimer des configs d'agents
// Les configs sont sauvegardées en JSON local via Electron
export default function ConfigPanel({ configs, onSauvegarder, onSupprimer }) {
  const configVide = { id: '', nom: '', repo: '', tache: '', useMock: true }
  const [formulaire, setFormulaire] = useState(configVide)
  const [message, setMessage] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormulaire(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSauvegarder() {
    if (!formulaire.nom || !formulaire.repo || !formulaire.tache) {
      setMessage(' Tous les champs sont obligatoires')
      return
    }
    // Génère un ID unique si nouveau
    const config = formulaire.id
      ? formulaire
      : { ...formulaire, id: `agent-${Date.now()}` }

    await onSauvegarder(config)
    setFormulaire(configVide)
    setMessage(' Configuration sauvegardée !')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="page">
      <h1>Configurations des Agents</h1>

      {/* Formulaire de création */}
      <section className="formulaire">
        <h2>Nouvelle configuration</h2>
        <label>Nom de l'agent
          <input name="nom" value={formulaire.nom} onChange={handleChange} placeholder="Ex: Fix Bug Login" />
        </label>
        <label>URL du dépôt GitHub
          <input name="repo" value={formulaire.repo} onChange={handleChange} placeholder="https://github.com/..." />
        </label>
        <label>Tâche à effectuer
          <textarea name="tache" value={formulaire.tache} onChange={handleChange} placeholder="Ex: Corriger le bug de déconnexion..." />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" name="useMock" checked={formulaire.useMock} onChange={handleChange} />
          Utiliser le mock Python (pas de vrai appel API)
        </label>
        {message && <div className="message">{message}</div>}
        <button className="btn-lancer" onClick={handleSauvegarder}> Sauvegarder</button>
      </section>

      {/* Liste des configs existantes */}
      <section>
        <h2>Configurations sauvegardées ({configs.length})</h2>
        {configs.length === 0 ? (
          <p className="vide">Aucune configuration. Crée-en une ci-dessus.</p>
        ) : (
          <div className="grid">
            {configs.map(cfg => (
              <div key={cfg.id} className="config-card">
                <div className="config-nom">{cfg.nom}</div>
                <div className="config-repo">{cfg.repo}</div>
                <div className="config-tache">{cfg.tache}</div>
                <div className="config-mode">{cfg.useMock ? ' Mock Python' : ' API Jules'}</div>
                <button
                  className="btn-arreter"
                  onClick={() => onSupprimer(`${cfg.nom.replace(/\s+/g, '_')}.json`)}
                >
                   Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
