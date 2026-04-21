const { spawn } = require('child_process')
const path = require('path')

const agentsActifs = new Map()

function lancerAgent(config, onUpdate) {
  const scriptPath = path.join(__dirname, '../mock/mock_agent.py')
  const proc = spawn('python3', [scriptPath, config.nom])

  agentsActifs.set(config.id, { process: proc, status: 'en_cours' })
  onUpdate({ agentId: config.id, status: 'en_cours' })

  proc.on('close', (code) => {
    const statut = code === 0 ? 'termine' : 'erreur'
    onUpdate({ agentId: config.id, status: statut })
    agentsActifs.delete(config.id)
  })

  return { succes: true, message: "Agent démarré" }
}

function arreterAgent(agentId, onUpdate) {
  const agent = agentsActifs.get(agentId)
  if (agent) {
    agent.process.kill()
    agentsActifs.delete(agentId)
    onUpdate({ agentId, status: 'arrete' })
  }
  return { succes: true }
}

module.exports = { lancerAgent, arreterAgent }