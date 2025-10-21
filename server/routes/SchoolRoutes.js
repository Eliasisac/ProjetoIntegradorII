const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rota para listar todas as escolas (Protegida apenas por autenticação, pois Clientes/Técnicos precisam do nome)
router.get('/', authMiddleware, schoolController.getAllSchools);

// Rota para criar nova escola (Apenas Admin)
router.post('/', authMiddleware, adminMiddleware, schoolController.createSchool);

// Rota para obter uma escola por ID (Apenas Admin)
router.get('/:id', authMiddleware, adminMiddleware, schoolController.getSchoolById);

// Rota para atualizar uma escola (Apenas Admin)
router.put('/:id', authMiddleware, adminMiddleware, schoolController.updateSchool);

// Rota para deletar uma escola (Apenas Admin)
router.delete('/:id', authMiddleware, adminMiddleware, schoolController.deleteSchool);

module.exports = router;
