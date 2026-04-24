const fs = require('fs')
const path = require('path')

const DOSSIER_CONFIGS = path.join(__dirname, '../data/agents')
const DOSSIER_DATA = path.join(__dirname, '../data')

// Crée les dossiers nécessaires au démarrage si ils n'existent pas encore
function initDossiers() {
  if (!fs.existsSync(DOSSIER_CONFIGS)) {
    fs.mkdirSync(DOSSIER_CONFIGS, { recursive: true })
  }
}
initDossiers()

// Lit tous les fichiers JSON du dossier agents et les retourne sous forme de tableau
function chargerConfigs() {
  if (!fs.existsSync(DOSSIER_CONFIGS)) return []
  const fichiers = fs.readdirSync(DOSSIER_CONFIGS).filter(f => f.endsWith('.json'))
  return fichiers.map(f => JSON.parse(fs.readFileSync(path.join(DOSSIER_CONFIGS, f), 'utf-8')))
}

// Sauvegarde une config d'agent dans un fichier JSON 
function sauvegarderConfig(config) {
  const chemin = path.join(DOSSIER_CONFIGS, `${config.nom.replace(/\s+/g, '_')}.json`)
  fs.writeFileSync(chemin, JSON.stringify(config, null, 2))
  return { succes: true }
}

// Supprime le fichier JSON d'une config d'agent par son nom de fichier
function supprimerConfig(nomFichier) {
  const chemin = path.join(DOSSIER_CONFIGS, nomFichier)
  if (fs.existsSync(chemin)) fs.unlinkSync(chemin)
  return { succes: true }
}

module.exports = { 
  chargerConfigs, 
  sauvegarderConfig, 
  supprimerConfig, 
}