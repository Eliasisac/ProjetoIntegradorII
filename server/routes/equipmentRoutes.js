// routes/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController'); // Certifique-se de que esta linha está aqui!
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, equipmentController.createEquipment);

// Nova rota para listar todos os equipamentos (protegida com autenticação e permissão de admin)
router.get('/', authMiddleware, adminMiddleware, equipmentController.getAllEquipments);


module.exports = router;