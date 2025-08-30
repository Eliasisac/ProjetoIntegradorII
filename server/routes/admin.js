app.get('/admin', (req, res) => {
  // TODO: verificar se usuário tem tag admin no banco de dados
  
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});