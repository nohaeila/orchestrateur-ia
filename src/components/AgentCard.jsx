// Carte affichant le statut d'un agent en temps réel

export default function AgentCard({ agent, onArreter }) {
  const statusLabel = {
    'en_cours': 'En cours',
    'en_attente': 'Attend ta réponse',
    'termine': 'Terminé',
    'erreur': 'Erreur',
    'arrete': 'Arrêté'
  }

  const statusClass = {
    'en_cours': 'status-encours',
    'en_attente': 'status-encours',
    'termine': 'status-termine',
    'erreur': 'status-erreur',
    'arrete': 'status-arrete'
  }

   // Calcule et formate le temps écoulé depuis le lancement de l'agent
  const tempsEcoule = () => {
    const debut = new Date(agent.startedAt)
    const secondes = Math.floor((new Date() - debut) / 1000)
    if (secondes < 60) return `${secondes}s`
    return `${Math.floor(secondes / 60)}min ${secondes % 60}s`
  }

  return (
    <div
      className={`agent-card ${statusClass[agent.status]}`}
      style={{
        cursor: 'pointer',
        transition: 'border 0.2s'
      }}
    >
      <div className="agent-header">
        <span className="agent-nom">{agent.nom}</span>
        <span className={`badge ${statusClass[agent.status]}`}>
          {statusLabel[agent.status]}
        </span>
      </div>
      <div className="agent-repo">{agent.repo}</div>
      <div className="agent-tache">{agent.tache}</div>
      <div className="agent-temps">⏱ Démarré il y a {tempsEcoule()}</div>

      {/* Lien Pull Request si Jules a terminé */}
      {agent.pullRequest && (
        <a
          href={agent.pullRequest}
          target="_blank"
          rel="noreferrer"
          className="btn-lancer"
          style={{ display: 'block', textAlign: 'center', marginTop: '8px', textDecoration: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          Voir la Pull Request
        </a>
      )}
      
      {/* Bouton Arrêter visible uniquement si l'agent est encore actif */}
      {agent.status === 'en_cours' || agent.status === 'en_attente' ? (
        <button
          className="btn-arreter"
          onClick={(e) => { e.stopPropagation(); onArreter(agent.id) }}
        >
          Arrêter
        </button>
      ) : null}
    </div>
  )
}