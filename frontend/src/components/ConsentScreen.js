import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsentScreen = ({ request }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [manualRequestId, setManualRequestId] = useState('');

  const handleConsent = async (requestId, approved) => {
    try {
      await axios.post('http://localhost:5000/api/confirm-access', {
        requestId,
        approved
      });
      
      alert(approved ? '✅ Accès autorisé' : '❌ Accès refusé');
      setPendingRequests(prev => prev.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error('Erreur consentement:', error);
    }
  };

  const addManualRequest = () => {
    if (manualRequestId) {
      setPendingRequests(prev => [...prev, { 
        requestId: manualRequestId, 
        doctorId: 'doctor-123',
        timestamp: new Date()
      }]);
      setManualRequestId('');
    }
  };

  useEffect(() => {
    if (request) {
      setPendingRequests(prev => [...prev, request]);
    }
  }, [request]);

  return (
    <div className="form-container">
      <h2>🔐 Gestion du Consentement</h2>
      
      <div className="form-group">
        <label>ID de demande manuelle (pour test):</label>
        <input 
          value={manualRequestId}
          onChange={(e) => setManualRequestId(e.target.value)}
          placeholder="Entrez un ID de demande"
        />
        <button onClick={addManualRequest} className="btn">➕ Ajouter Demande</button>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="patient-info">
          <p>Aucune demande d'accès en attente</p>
        </div>
      ) : (
        <div>
          <h3>Demandes d'Accès en Attente</h3>
          {pendingRequests.map((req, index) => (
            <div key={index} className="consent-card">
              <p><strong>Médecin ID:</strong> {req.doctorId}</p>
              <p><strong>Demande ID:</strong> {req.requestId}</p>
              <p><strong>Heure:</strong> {new Date(req.timestamp).toLocaleString()}</p>
              
              <div className="btn-group">
                <button 
                  onClick={() => handleConsent(req.requestId, true)}
                  className="btn"
                >
                  ✅ Autoriser
                </button>
                <button 
                  onClick={() => handleConsent(req.requestId, false)}
                  className="btn btn-danger"
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsentScreen;