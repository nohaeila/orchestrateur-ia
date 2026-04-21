const fs = require('fs')
const path = require('path')

const DOSSIER_CONFIGS = path.join(__dirname, '../data/agents')

function initDossiers() {
  if (!fs.existsSync(DOSSIER_CONFIGS)) {
    fs.mkdirSync(DOSSIER_CONFIGS, { recursive: true })
  }
}
initDossiers()

function chargerConfigs() {
  if (!fs.existsSync(DOSSIER_CONFIGS)) return []
  const fichiers = fs.readdirSync(DOSSIER_CONFIGS).filter(f => f.endsWith('.json'))
  return fichiers.map(f => JSON.parse(fs.readFileSync(path.join(DOSSIER_CONFIGS, f), 'utf-8')))
}

function sauvegarderConfig(config) {
  const chemin = path.join(DOSSIER_CONFIGS, `${config.nom}.json`)
  fs.writeFileSync(chemin, JSON.stringify(config, null, 2))
  return { succes: true }
}

function supprimerConfig(nomFichier) {
  const chemin = path.join(DOSSIER_CONFIGS, nomFichier)
  if (fs.existsSync(chemin)) fs.unlinkSync(chemin)
  return { succes: true }
}

module.exports = { chargerConfigs, sauvegarderConfig, supprimerConfig }