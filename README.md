# Orchestrateur IA — Dashboard Desktop

>Application Desktop permettant de piloter visuellement une flotte d'agents IA (Jules by Google) depuis un dashboard centralisé.

## Technologies

- **Electron** — Application desktop native 
- **React** — Interface graphique réactive
- **Vite** — Build tool rapide
- **Node.js** — Accès système de fichiers

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

data/              ← Persistance locale (système de fichiers)
  agents/          ← Un fichier .json par configuration d'agent

```

## Prérequis

- Node.js >= 18
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
- Intégration API REST Jules (jules.googleapis.com) pour exécuter de vraies tâches sur GitHub
- Récupération et affichage automatique de l'URL de la Pull Request générée par Jules
- Gestion sécurisée de la clé API via fichier .env
- Arrêt d'un agent en cours d'exécution
- Dashboard de monitoring avec statut en temps réel
- Création et sauvegarde de configurations d'agents (JSON local)

## Membres de l'équipe

- Nohaeila Laghalid
