const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'healthpass-secret-key';

app.use(cors());
app.use(express.json());

// Stockage en mémoire (simulation)
const accessRequests = new Map();
const encryptedData = new Map();

// Chiffrement/déchiffrement
const encrypt = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
const decrypt = (encryptedData) => JSON.parse(CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8));

// POST /api/request-access - Médecin demande accès
app.post('/api/request-access', (req, res) => {
  const { patientId, doctorId } = req.body;
  const requestId = uuidv4();
  
  accessRequests.set(requestId, {
    patientId,
    doctorId,
    status: 'pending',
    timestamp: new Date()
  });
  
  res.json({ requestId, message: 'Demande d\'accès envoyée' });
});

// POST /api/confirm-access - Patient approuve/refuse
app.post('/api/confirm-access', (req, res) => {
  const { requestId, approved } = req.body;
  const request = accessRequests.get(requestId);
  
  if (!request) {
    return res.status(404).json({ error: 'Demande non trouvée' });
  }
  
  request.status = approved ? 'approved' : 'denied';
  accessRequests.set(requestId, request);
  
  res.json({ message: approved ? 'Accès autorisé' : 'Accès refusé' });
});

// GET /api/patient/:id/data - Récupérer données patient
app.get('/api/patient/:id/data', (req, res) => {
  const { id } = req.params;
  const { requestId } = req.query;
  
  const request = accessRequests.get(requestId);
  if (!request || request.status !== 'approved') {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }
  
  const data = encryptedData.get(id);
  if (!data) {
    return res.status(404).json({ error: 'Données non trouvées' });
  }
  
  res.json({ data: decrypt(data) });
});

// POST /api/sync - Synchronisation données chiffrées
app.post('/api/sync', (req, res) => {
  const { patientId, data } = req.body;
  const encrypted = encrypt(data);
  encryptedData.set(patientId, encrypted);
  
  res.json({ message: 'Données synchronisées' });
});

app.listen(PORT, () => {
  console.log(`Backend HealthPass.MA démarré sur le port ${PORT}`);
});