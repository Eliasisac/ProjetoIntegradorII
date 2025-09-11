// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//Rota para listar todos os usuários (apenas para admins)
router.get('/', authMiddleware, adminMiddleware,userController.getAllUsers);
// Rota para obter um usuário por ID
router.get('/:id', authMiddleware, userController.getUserById);
// Rotas para o gerenciamento de usuários
router.put('/:id', authMiddleware, userController.updateUser);

// Rota para remover um usuário (apenas o próprio usuário ou um admin)
router.delete('/:id', authMiddleware, userController.deleteUser); 


// Exporte o router
module.exports = router;