import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientForm from './components/PatientForm';
import QRCodeScreen from './components/QRCodeScreen';
import DoctorScan from './components/DoctorScan';
import ConsentScreen from './components/ConsentScreen';
import './App.css';

function App() {
  const [patientData, setPatientData] = useState(null);
  const [accessRequest, setAccessRequest] = useState(null);

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>🏥 HealthPass.MA</h1>
          <nav>
            <Link to="/">Patient</Link>
            <Link to="/doctor">Médecin</Link>
            <Link to="/consent">Consentement</Link>
          </nav>
        </header>
        
        <main className="main">
          <Routes>
            <Route path="/" element={
              <>
                <PatientForm onDataSaved={setPatientData} />
                {patientData && <QRCodeScreen data={patientData} />}
              </>
            } />
            <Route path="/doctor" element={<DoctorScan onAccessRequest={setAccessRequest} />} />
            <Route path="/consent" element={<ConsentScreen request={accessRequest} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;