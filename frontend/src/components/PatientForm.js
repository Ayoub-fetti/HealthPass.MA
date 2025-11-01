import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const PatientForm = ({ onDataSaved }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    dateNaissance: '',
    sexe: '',
    poids: '',
    taille: '',
    groupeSanguin: '',
    allergies: '',
    traitements: '',
    urgence: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const patientId = Date.now().toString();
    const dataWithId = { ...formData, patientId };
    
    // Stockage local
    localStorage.setItem('healthpass-data', JSON.stringify(dataWithId));
    
    // Synchronisation backend
    try {
      const response = await axios.post('http://localhost:5000/api/sync', {
        patientId,
        data: dataWithId
      });
      console.log('✅ Données synchronisées avec le serveur:', response.data);
    } catch (error) {
      console.log('⚠️ Sync offline, données sauvées localement:', error.message);
    }
    
    onDataSaved(dataWithId);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-container">
      <h2>📋 Dossier Médical</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom / الاسم العائلي:</label>
            <input name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Prénom / الاسم الشخصي:</label>
            <input name="prenom" value={formData.prenom} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Âge / العمر:</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} min="0" max="120" />
          </div>
          
          <div className="form-group">
            <label>Date de naissance / تاريخ الميلاد:</label>
            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Sexe / الجنس:</label>
            <select name="sexe" value={formData.sexe} onChange={handleChange}>
              <option value="">Sélectionner / اختر</option>
              <option value="M">Masculin / ذكر</option>
              <option value="F">Féminin / أنثى</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Groupe Sanguin / فصيلة الدم:</label>
            <select name="groupeSanguin" value={formData.groupeSanguin} onChange={handleChange}>
              <option value="">Sélectionner / اختر</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Poids (kg) / الوزن:</label>
            <input type="number" name="poids" value={formData.poids} onChange={handleChange} min="0" step="0.1" />
          </div>
          
          <div className="form-group">
            <label>Taille (cm) / الطول:</label>
            <input type="number" name="taille" value={formData.taille} onChange={handleChange} min="0" />
          </div>
          
          <div className="form-group full-width">
            <label>Allergies / الحساسية:</label>
            <textarea name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Décrivez vos allergies / اذكر الحساسية" />
          </div>
          
          <div className="form-group full-width">
            <label>Traitements / العلاجات:</label>
            <textarea name="traitements" value={formData.traitements} onChange={handleChange} placeholder="Médicaments actuels / الأدوية الحالية" />
          </div>
          
          <div className="form-group full-width">
            <label>Contact d'urgence / جهة الاتصال للطوارئ:</label>
            <input name="urgence" value={formData.urgence} onChange={handleChange} placeholder="Nom et téléphone / الاسم والهاتف" />
          </div>
        </div>
        
        <button type="submit" className="btn">💾 Sauvegarder</button>
      </form>
    </div>
  );
};

export default PatientForm;