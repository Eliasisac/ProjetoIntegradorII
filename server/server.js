require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const rotas = require('./routes/rotas');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// facilita encontrar os arquivos no publico sem precisar mencionar um a um diretamente
app.use(express.static(path.join(__dirname, '..', 'public')));

// === LOGIN ====
// tela de login mostrada antes de qualquer outra
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'front', 'login', 'login.html'));
});


// Rotas da API prefixadas para evitar conflito
app.use('/api/auth', authRoutes);

app.use('/', rotas);


sequelize.sync({ force: false })
    .then(() => {
        console.log('Banco de dados PostgreSQL conectado e sincronizado com Sequelize.');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
        process.exit(1);
    });
