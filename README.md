# HealthPass.MA

🏥 **Passeport santé numérique chiffré** - MVP complet avec frontend React et backend Express.js

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/votre-username/HealthPass.MA.git
cd HealthPass.MA

# Installer toutes les dépendances (frontend + backend)
npm run install-all
```

### Démarrage
```bash
# Démarrer frontend et backend simultanément
npm run dev

# OU démarrer séparément :
# Backend (port 5000)
npm run server

# Frontend (port 3000)
npm run client
```

## 📱 Fonctionnalités

### Patient
- **Formulaire médical** : Saisie des données (nom, groupe sanguin, allergies, traitements)
- **QR Code chiffré** : Génération automatique avec résumé médical
- **Stockage local** : Données sauvées offline avec IndexedDB
- **Consentement** : Autorisation/refus d'accès aux médecins

### Médecin
- **Scanner QR** : Lecture des données patient chiffrées
- **Demande d'accès** : Requête d'autorisation via backend
- **Dossier complet** : Accès aux données complètes après consentement

## 🔧 Architecture

```
HealthPass.MA/
├── backend/          # Express.js API
│   ├── server.js     # Serveur principal
│   └── package.json
├── frontend/         # React App
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   └── package.json
└── package.json      # Scripts globaux
```

## 🔐 Sécurité

- **Chiffrement AES-256** : Données médicales chiffrées localement et sur serveur
- **QR Code sécurisé** : Résumé minimal chiffré dans le QR
- **Consentement explicite** : Patient contrôle l'accès à ses données
- **JWT simulation** : Authentification basique pour la démo

## 🌐 Endpoints API

- `POST /api/request-access` - Demande d'accès médecin
- `POST /api/confirm-access` - Consentement patient
- `GET /api/patient/:id/data` - Récupération données autorisées
- `POST /api/sync` - Synchronisation chiffrée

## 🎯 Scénario de Démonstration

1. **Patient** : Remplit le formulaire médical → génère QR code
2. **Médecin** : Scanne QR → demande accès complet
3. **Patient** : Reçoit notification → autorise l'accès
4. **Médecin** : Accède au dossier médical complet

## 🛠️ Technologies

- **Frontend** : React, React Router, QRCode.react, CryptoJS
- **Backend** : Express.js, CORS, JWT, UUID
- **Chiffrement** : AES-256 (CryptoJS)
- **Stockage** : LocalStorage + mémoire serveur (démo)

## 📋 URLs

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000
- **Patient** : http://localhost:3000/
- **Médecin** : http://localhost:3000/doctor
- **Consentement** : http://localhost:3000/consent