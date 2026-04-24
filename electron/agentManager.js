const https = require('https')

// Stocke les agents en cours d'exécution en mémoire 
const agentsActifs = new Map()
const JULES_API_KEY = process.env.JULES_API_KEY
const BASE_URL = 'jules.googleapis.com'

// Fonction utilitaire générique pour appeler l'API REST Jules
function julesRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/v1alpha${path}`,
      method: method,
      headers: {
        'x-goog-api-key': JULES_API_KEY,
        'Content-Type': 'application/json'
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch {
          resolve({})
        }
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

// Récupère la liste des repos GitHub connectés au compte Jules
async function listerSources() {
  const result = await julesRequest('GET', '/sources')
  console.log("SOURCES DISPONIBLES:", JSON.stringify(result))
  return result
}

// Lance un agent : crée une session Jules avec le repo et la tâche de la config
async function lancerAgent(config, onUpdate) {
  try {
    await listerSources()
    console.log("Clé API Jules:", JULES_API_KEY ? "présente" : "MANQUANTE")
    
    const body = {
      prompt: config.tache,
      title: config.nom,
      automationMode: 'AUTO_CREATE_PR',
      sourceContext: {
        source: `sources/github/${config.repo.replace('https://github.com/', '')}`,
        githubRepoContext: {
          startingBranch: 'main'
        }
      }
    }

    console.log("Body envoyé à Jules:", JSON.stringify(body))
    
    const session = await julesRequest('POST', '/sessions', body)
    
    console.log("Réponse Jules:", JSON.stringify(session))

    if (session.error || !session.id) {
      console.error("Erreur Jules:", session)
      onUpdate({ agentId: config.id, status: 'erreur' })
      return { succes: false }
    }

    agentsActifs.set(config.id, { sessionId: session.id, status: 'en_cours' })
    onUpdate({ agentId: config.id, status: 'en_cours', sessionId: session.id })
    demarrerPolling(config.id, session.id, onUpdate)

    return { succes: true, sessionId: session.id }

  } catch (err) {
    console.error('Erreur Jules:', err)
    onUpdate({ agentId: config.id, status: 'erreur' })
    return { succes: false }
  }
}

// Interroge Jules toutes les 5 secondes pour connaître l'état de la session
function demarrerPolling(agentId, sessionId, onUpdate) {
  const interval = setInterval(async () => {
    try {
      const session = await julesRequest('GET', `/sessions/${sessionId}`)
      const etat = session.state

      // Correspondance entre les états Jules et nos états internes
      const mapEtat = {
        'QUEUED': 'en_cours',
        'PLANNING': 'en_cours',
        'AWAITING_PLAN_APPROVAL': 'en_cours',
        'IN_PROGRESS': 'en_cours',
        'AWAITING_USER_FEEDBACK': 'en_attente',
        'COMPLETED': 'termine',
        'FAILED': 'erreur',
        'PAUSED': 'en_cours'
      }

      const nouveauStatut = mapEtat[etat] || 'en_cours'

      // Notifie React avec le nouveau statut et l'URL de la PR si disponible
      onUpdate({ 
        agentId, 
        status: nouveauStatut, 
        sessionId,
        etatJules: etat,
        pullRequest: session.outputs?.[1]?.pullRequest?.url 
          || session.outputs?.[0]?.pullRequest?.url 
          || session.url
          || null
      })

      // Quand Jules a terminé ou échoué, on arrête 
      if (etat === 'COMPLETED' || etat === 'FAILED') {
        console.log("OUTPUTS JULES:", JSON.stringify(session.outputs))
        clearInterval(interval)
        agentsActifs.delete(agentId)
      }

    } catch (err) {
      console.error('Erreur polling:', err)
      clearInterval(interval)
    }
  }, 5000)

  const agent = agentsActifs.get(agentId)
  if (agent) agent.interval = interval
}

// Arrête un agent en cours
async function arreterAgent(agentId, onUpdate) {
  const agent = agentsActifs.get(agentId)
  if (agent) {
    if (agent.interval) clearInterval(agent.interval)
    if (agent.sessionId) {
      await julesRequest('DELETE', `/sessions/${agent.sessionId}`)
    }
    agentsActifs.delete(agentId)
    onUpdate({ agentId, status: 'arrete' })
  }
  return { succes: true }
}

// Envoie un message texte à une session Jules active
async function envoyerMessage(agentId, message) {
  const agent = agentsActifs.get(agentId)
  if (!agent || !agent.sessionId) {
    return { succes: false, message: "Aucun agent actif trouvé" }
  }
  await julesRequest('POST', `/sessions/${agent.sessionId}:sendMessage`, {
    prompt: message
  })
  return { succes: true }
}

module.exports = { lancerAgent, arreterAgent, envoyerMessage }