import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const DoctorScan = ({ onAccessRequest }) => {
  const [qrData, setQrData] = useState('');
  const [patientInfo, setPatientInfo] = useState(() => {
    const saved = localStorage.getItem('doctor-patient-info');
    return saved ? JSON.parse(saved) : null;
  });
  const [requestId, setRequestId] = useState(() => {
    return localStorage.getItem('doctor-request-id') || null;
  });
  const [fullData, setFullData] = useState(() => {
    const saved = localStorage.getItem('doctor-full-data');
    return saved ? JSON.parse(saved) : null;
  });
  const [status, setStatus] = useState(() => {
    return localStorage.getItem('doctor-status') || '';
  });

  const handleQRInput = () => {
    try {
      const decrypted = CryptoJS.AES.decrypt(qrData, 'qr-secret').toString(CryptoJS.enc.Utf8);
      const patientData = JSON.parse(decrypted);
      setPatientInfo(patientData);
      localStorage.setItem('doctor-patient-info', JSON.stringify(patientData));
      setStatus('Patient scanné. Demande d\'accès envoyée.');
      localStorage.setItem('doctor-status', 'Patient scanné. Demande d\'accès envoyée.');
      requestAccess(patientData.id);
    } catch (error) {
      alert('QR Code invalide');
    }
  };

  const requestAccess = async (patientId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/request-access', {
        patientId,
        doctorId: 'doctor-123'
      });
      setRequestId(response.data.requestId);
      localStorage.setItem('doctor-request-id', response.data.requestId);
      const statusMsg = `Demande envoyée. ID: ${response.data.requestId}`;
      setStatus(statusMsg);
      localStorage.setItem('doctor-status', statusMsg);
      onAccessRequest(response.data);
    } catch (error) {
      const errorMsg = 'Erreur lors de la demande d\'accès';
      setStatus(errorMsg);
      localStorage.setItem('doctor-status', errorMsg);
    }
  };

  const checkAccess = async () => {
    if (!requestId || !patientInfo) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/patient/${patientInfo.id}/data?requestId=${requestId}`);
      setFullData(response.data.data);
      localStorage.setItem('doctor-full-data', JSON.stringify(response.data.data));
      const successMsg = 'Accès autorisé ! Données reçues.';
      setStatus(successMsg);
      localStorage.setItem('doctor-status', successMsg);
    } catch (error) {
      const waitMsg = 'Accès en attente ou refusé';
      setStatus(waitMsg);
      localStorage.setItem('doctor-status', waitMsg);
    }
  };
  
  useEffect(() => {
    if (requestId && patientInfo && !fullData) {
      const interval = setInterval(checkAccess, 3000);
      return () => clearInterval(interval);
    }
  }, [requestId, patientInfo, fullData]);

  return (
    <div className="scanner-section">
      <h2>👨‍⚕️ Scanner Médecin</h2>
      
      <div className="form-group">
        <label>Coller le contenu du QR Code:</label>
        <textarea 
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
          placeholder="Collez ici le contenu du QR code scanné"
          rows="3"
        />
        <div className="btn-group">
          <button onClick={handleQRInput} className="btn">🔍 Analyser QR</button>
          <button 
            onClick={() => {
              localStorage.clear();
              setPatientInfo(null);
              setRequestId(null);
              setFullData(null);
              setStatus('');
              setQrData('');
            }} 
            className="btn btn-danger"
          >
            🗑️ Effacer
          </button>
        </div>
      </div>

      {status && (
        <div className="patient-info">
          <p>{status}</p>
          {requestId && <p><strong>Request ID:</strong> {requestId}</p>}
        </div>
      )}

      {patientInfo && !fullData && (
        <div className="consent-card">
          <h3>📱 Informations Patient (QR)</h3>
          <p><strong>Nom:</strong> {patientInfo.nom} {patientInfo.prenom}</p>
          {patientInfo.age && <p><strong>Âge:</strong> {patientInfo.age} ans</p>}
          {patientInfo.sexe && <p><strong>Sexe:</strong> {patientInfo.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>}
          {patientInfo.groupe && <p><strong>Groupe Sanguin:</strong> <span style={{color: '#d32f2f', fontWeight: 'bold'}}>{patientInfo.groupe}</span></p>}
          {patientInfo.allergies && <p><strong>Allergies:</strong> <span style={{color: '#f57c00'}}>{patientInfo.allergies}</span></p>}
          {patientInfo.urgence && <p><strong>Contact urgence:</strong> {patientInfo.urgence}</p>}
        </div>
      )}

      {fullData && (
        <div className="consent-card">
          <h3>✅ Dossier Médical Complet</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
            <div>
              <h4>👤 Informations Personnelles</h4>
              <p><strong>Nom:</strong> {fullData.nom} {fullData.prenom}</p>
              {fullData.age && <p><strong>Âge:</strong> {fullData.age} ans</p>}
              {fullData.dateNaissance && <p><strong>Date de naissance:</strong> {new Date(fullData.dateNaissance).toLocaleDateString('fr-FR')}</p>}
              {fullData.sexe && <p><strong>Sexe:</strong> {fullData.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>}
            </div>
            
            <div>
              <h4>📊 Données Physiques</h4>
              {fullData.poids && <p><strong>Poids:</strong> {fullData.poids} kg</p>}
              {fullData.taille && <p><strong>Taille:</strong> {fullData.taille} cm</p>}
              {fullData.poids && fullData.taille && (
                <p><strong>IMC:</strong> {(fullData.poids / Math.pow(fullData.taille/100, 2)).toFixed(1)}</p>
              )}
              {fullData.groupeSanguin && <p><strong>Groupe Sanguin:</strong> <span style={{color: '#d32f2f', fontWeight: 'bold'}}>{fullData.groupeSanguin}</span></p>}
            </div>
          </div>
          
          <div>
            <h4>🏥 Informations Médicales</h4>
            {fullData.allergies && (
              <p><strong>Allergies:</strong> <span style={{color: '#f57c00'}}>{fullData.allergies}</span></p>
            )}
            {fullData.traitements && (
              <p><strong>Traitements actuels:</strong> {fullData.traitements}</p>
            )}
            {fullData.urgence && (
              <p><strong>Contact d'urgence:</strong> <span style={{color: '#1976d2'}}>{fullData.urgence}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorScan;