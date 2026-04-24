# Orchestrateur IA — Dashboard Desktop

> Application Desktop permettant de piloter visuellement une flotte d'agents IA (Jules by Google) depuis un dashboard centralisé.

## Technologies

- **Electron** — Application desktop native 
- **React** — Interface graphique réactive
- **Vite** — Build tool rapide
- **Node.js** — Accès système de fichiers, lancement de processus
- **Python ** — Mock de l'agent IA

## Architecture (MVC)

electron/          ← Modèle + Contrôleur (Node.js / Electron)
  main.js          ← Point d'entrée, création de la fenêtre
  preload.js       ← Pont sécurisé Electron ↔ React (contextBridge)
  ipcHandlers.js   ← Canaux IPC : reçoit les actions de React
  agentManager.js  ← Logique métier : lancer/arrêter les agents
  fileService.js   ← Lecture/écriture JSON (configs + logs)

src/               ← Vue (React)
  App.jsx          ← Composant racine, état global
  components/
    Dashboard.jsx  ← Liste des agents actifs + configs disponibles
    AgentCard.jsx  ← Carte d'un agent avec statut temps réel
    ConfigPanel.jsx← Formulaire de création/suppression de configs
    LogViewer.jsx  ← Historique des exécutions

data/              ← Persistance locale (système de fichiers)
  agents/          ← Un fichier .json par configuration d'agent
  logs/
    history.json   ← Historique de toutes les exécutions

mock/
  mock_agent.py    ← Simule un agent IA (pause 60s puis exit 0)
```

## Prérequis

- Node.js >= 18
- Python 3
- npm

## Installation et lancement

cd orchestrateur-ia

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

## Fonctionnalités

### MVP (Produit Minimum Viable)
- Lancement d'un agent IA via mock Python ou API Jules
- Arrêt d'un agent en cours d'exécution
- Dashboard de monitoring avec statut en temps réel
- Création et sauvegarde de configurations d'agents (JSON local)
- Historique persistant des exécutions

### Exigences techniques respectées
- **Application Desktop native** : Electron (.exe Windows, .app macOS)
- **IHM fenêtrée** : React + Electron, pas d'UI freeze (async/IPC)
- **Manipulation de fichiers** : configs JSON dans `data/agents/`, logs dans `data/logs/`
- **Architecture MVC** : séparation stricte Vue (React) / Contrôleur (ipcHandlers) / Modèle (fileService)
- **Programmation asynchrone** : `ipcRenderer.invoke` + `ipcMain.handle` (Promise-based)

## Membres de l'équipe

- Nohaeila Laghalid
