import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx'; // Importa o componente de login
import PainelSolicitacoes from './PainelSolicitacoes.jsx'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/solicitacoes" element={<PainelSolicitacoes />} />
      </Routes>
    </Router>
  );
}

export default App;