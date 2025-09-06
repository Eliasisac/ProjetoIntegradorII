// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//Rota para listar todos os usuários (apenas para admins)
router.get('/', authMiddleware, adminMiddleware,userController.getAllUsers);
// Rotas para o gerenciamento de usuários
router.put('/:id', authMiddleware, userController.updateUser);

// Exporte o router
module.exports = router;