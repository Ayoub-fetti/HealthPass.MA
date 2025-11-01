import React from 'react';
import QRCode from 'qrcode.react';
import CryptoJS from 'crypto-js';

const QRCodeScreen = ({ data }) => {
  // Résumé minimal pour QR code
  const summary = {
    id: data.patientId,
    nom: data.nom,
    prenom: data.prenom,
    age: data.age,
    sexe: data.sexe,
    groupe: data.groupeSanguin,
    allergies: data.allergies ? data.allergies.substring(0, 50) : '',
    urgence: data.urgence
  };
  
  // Chiffrement du résumé
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(summary), 'qr-secret').toString();
  
  return (
    <div className="qr-section">
      <h2>📱 QR Code Médical</h2>
      <QRCode 
        value={encrypted}
        size={200}
        level="M"
      />
      <p>Présentez ce QR code au médecin</p>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        ID Patient: {data.patientId}
      </div>
    </div>
  );
};

export default QRCodeScreen;