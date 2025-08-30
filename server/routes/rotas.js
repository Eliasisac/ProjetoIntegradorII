const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const path = require('path');

// Admin
router.get('/admin', authMiddleware, (req, res) => {
  console.log('Usuário autenticado:', req.user);
  if (req.user.tipo_usuario !== 'admin') return res.status(403).send('Acesso negado');
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'front', 'admin', 'index.html'));
});

router.get('/tecnico', authMiddleware, (req, res) => {
  console.log('Usuário autenticado:', req.user);
  if (req.user.tipo_usuario !== 'tecnico') return res.status(403).send('Acesso negado');
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'front', 'tecnico', 'index.html'));
});





module.exports = router;