require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API do HelpDeskSphere está online e funcionando!');
});

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