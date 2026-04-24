import { useState } from 'react'
import AgentCard from './AgentCard'


export default function Dashboard({ agentsActifs, configs, onLancer, onArreter }) {

  return (
    <div className="page">
      <h1>Dashboard de contrôle</h1>

      {/* AGENTS ACTIFS */}
      <section>
        <h2>Flux en temps réel ({agentsActifs.length})</h2>
        {agentsActifs.length === 0 ? (
          <p className="vide">En attente de lancement d'un agent...</p>
        ) : (
          <div className="grid">
            {agentsActifs.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onArreter={onArreter}
              />
            ))}
          </div>
        )}
      </section>

      {/* ACTIONS RAPIDES */}
      <section>
        <h2>Actions rapides</h2>
        <div className="grid">
          {configs.map(config => (
            <div key={config.id} className="config-card">
              <div className="config-nom">{config.nom}</div>
              <div className="config-tache" style={{ fontSize: '12px', opacity: 0.7, margin: '4px 0' }}>
                {config.tache}
              </div>
              <button onClick={() => onLancer(config)} className="btn-lancer">
                Lancer
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}