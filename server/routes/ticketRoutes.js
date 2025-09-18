// ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


// Nova rota para listar todos os tickets (com filtros e paginação)
router.get('/', authMiddleware, ticketController.getAllTickets);

// Rota para criar um novo chamado (protegida com autenticação)
router.post('/', authMiddleware, ticketController.createTicket);
// Rota para buscar um ticket por ID
router.get('/:id', authMiddleware, ticketController.getTicketById);
// Nova rota de atualização
router.put('/:id', authMiddleware, adminMiddleware, ticketController.updateTicket); 
// Rota para excluir um ticket (apenas admin ou o criador)
router.delete('/:id', authMiddleware, ticketController.deleteTicket);


module.exports = router;


