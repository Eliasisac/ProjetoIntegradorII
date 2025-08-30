const authMiddleware = require('./middlewares/authMiddleware');
const path = require('path');

// Admin
app.get('/admin', authMiddleware, (req, res) => {
  if (req.user.tipo_usuario !== 'admin') return res.status(403).send('Acesso negado');
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});