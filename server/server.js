// ==== Importações ====
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const associations = require('./models/associations');
const criarAdminSeNaoExistir = require('./seeds/criarAdmin.js'); 
const authRoutes = require('./routes/auth');
const rotas = require('./routes/rotas');

// ==== Inicialização do Servidor Express ====
const app = express();
const PORT = process.env.PORT || 5000;


// ==== Middlewares ====
// Esses middlewares devem ser os primeiros a serem usados
// Eles processam as requisições antes que cheguem às rotas
app.use(express.json()); 
app.use(cors());         

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// ==== Rotas da API ====
// Rota para a tela de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'front', 'login', 'login.html'));
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Outras rotas da aplicação
app.use('/', rotas);

// ==== Sincronização do Banco de Dados e Início do Servidor ====
sequelize.sync({ force: false })
    .then(() => {
        console.log('Banco de dados conectado e sincronizado com sucesso.');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
        criarAdminSeNaoExistir();
    })
    .catch(err => {
        console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
        process.exit(1);
    });

