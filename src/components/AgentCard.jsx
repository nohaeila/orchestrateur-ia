// Carte affichant le statut d'un agent en temps réel
export default function AgentCard({ agent, onArreter }) {
  const statusLabel = {
    'en_cours': ' En cours',
    'termine':  ' Terminé',
    'erreur':   ' Erreur',
    'arrete':   ' Arrêté'
  }

  const statusClass = {
    'en_cours': 'status-encours',
    'termine':  'status-termine',
    'erreur':   'status-erreur',
    'arrete':   'status-arrete'
  }

  // Calcule le temps écoulé depuis le lancement
  const tempsEcoule = () => {
    const debut = new Date(agent.startedAt)
    const maintenant = new Date()
    const secondes = Math.floor((maintenant - debut) / 1000)
    if (secondes < 60) return `${secondes}s`
    return `${Math.floor(secondes / 60)}min ${secondes % 60}s`
  }

  return (
    <div className={`agent-card ${statusClass[agent.status]}`}>
      <div className="agent-header">
        <span className="agent-nom">{agent.nom}</span>
        <span className={`badge ${statusClass[agent.status]}`}>
          {statusLabel[agent.status]}
        </span>
      </div>
      <div className="agent-repo"> {agent.repo}</div>
      <div className="agent-tache"> {agent.tache}</div>
      <div className="agent-temps"> Démarré il y a {tempsEcoule()}</div>

      {agent.status === 'en_cours' && (
        <button className="btn-arreter" onClick={() => onArreter(agent.id)}>
           Arrêter
        </button>
      )}
    </div>
  )
}
