import React, { useState } from 'react';
import axios from 'axios';

const TestData = () => {
  const [testResult, setTestResult] = useState('');

  const testDataFlow = async () => {
    try {
      // 1. Créer des données de test
      const testData = {
        nom: 'Test',
        prenom: 'Patient',
        age: '30',
        sexe: 'M',
        poids: '70',
        taille: '175',
        groupeSanguin: 'O+',
        allergies: 'Aucune',
        traitements: 'Aucun',
        urgence: 'Contact Test'
      };
      
      const patientId = 'test-' + Date.now();
      const dataWithId = { ...testData, patientId };
      
      // 2. Synchroniser avec le serveur
      await axios.post('http://localhost:5000/api/sync', {
        patientId,
        data: dataWithId
      });
      
      // 3. Créer une demande d'accès
      const accessResponse = await axios.post('http://localhost:5000/api/request-access', {
        patientId,
        doctorId: 'doctor-test'
      });
      
      const requestId = accessResponse.data.requestId;
      
      // 4. Approuver l'accès
      await axios.post('http://localhost:5000/api/confirm-access', {
        requestId,
        approved: true
      });
      
      // 5. Récupérer les données
      const dataResponse = await axios.get(`http://localhost:5000/api/patient/${patientId}/data?requestId=${requestId}`);
      
      setTestResult(`✅ Test réussi!\nDonnées récupérées: ${JSON.stringify(dataResponse.data.data, null, 2)}`);
      
    } catch (error) {
      setTestResult(`❌ Erreur: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h3>🧪 Test du Flux de Données</h3>
      <button onClick={testDataFlow} className="btn">
        Tester le Flux Complet
      </button>
      {testResult && (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          marginTop: '10px',
          whiteSpace: 'pre-wrap',
          fontSize: '12px'
        }}>
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default TestData;