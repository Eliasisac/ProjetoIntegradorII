// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  // A verificação de autenticação já é feita pelo authMiddleware
  // Esta linha apenas verifica a role
  if (req.user && req.user.role === 'admin') {
    next(); // Permite que a requisição continue
  } else {
    // Retorna um erro de acesso negado
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
  }
};

module.exports = adminMiddleware;