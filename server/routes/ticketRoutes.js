const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('./authMiddleware'); // Certifique-se de que o caminho está correto

// Rota para criar um novo chamado (protegida com autenticação)
router.post('/', authMiddleware, ticketController.createTicket);

module.exports = router;