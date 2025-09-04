// Importa o framework Express, necessário para criar e gerenciar rotas.
const express = require('express');
// Cria uma instância do Router do Express. O Router funciona como um "mini-aplicativo" para agrupar rotas.
const router = express.Router();
// Importa o controller de autenticação, que contém a lógica para as rotas de login, logout, etc.
const authController = require('../controllers/authController');

// Define uma rota para o método HTTP POST no caminho '/login'.
// Quando uma requisição POST é feita para '/login', a função 'login' do 'authController' é executada.
router.post('/login', authController.login);



// Define uma rota para o método HTTP POST no caminho '/register'.
// Quando uma requisição POST é feita para '/register', a função 'register' do 'authController' é executada.
router.post('/register', authController.register);


// Exporta o objeto 'router' com todas as suas rotas configuradas para ser usado no arquivo principal do servidor (app.js ou server.js).
module.exports = router;