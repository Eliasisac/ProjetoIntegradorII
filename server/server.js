
//dotenv é uma biblioteca que carrega variáveis de ambiente de um arquivo .env para process.env
//require('dotenv').config() carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();
// express é um framework web para Node.js que facilita a criação de servidores e APIs
//const express é a biblioteca express
//require('express') importa o módulo express
const express = require('express');

// cors é uma biblioteca que habilita o CORS (Cross-Origin Resource Sharing) em aplicações Express
// CORS é um mecanismo que permite que recursos restritos em uma página web sejam solicitados a partir de outro domínio fora do domínio do qual o recurso foi servido
//const cors é a biblioteca cors
//require('cors') importa o módulo cors
const cors = require('cors');

// path é um módulo nativo do Node.js que fornece utilitários para trabalhar com caminhos de arquivos e diretórios
//const path é o módulo path
//require('path') importa o módulo path
const path = require('path');

// sequelize é um ORM (Object-Relational Mapping) para Node.js que facilita a interação com bancos de dados SQL
//const sequelize é a instância de conexão com o banco de dados
//require('./config/database') importa a configuração do banco de dados do arquivo database.js

const sequelize = require('./config/database');

// Importa as rotas de autenticação e outras rotas
//const authRoutes é o conjunto de rotas relacionadas à autenticação
//require('./routes/auth') importa as rotas de autenticação do arquivo auth.js
const authRoutes = require('./routes/auth');

//const rotas é o conjunto de rotas da aplicação
//require('./routes/rotas') importa as rotas da aplicação do arquivo rotas.js
// rotas.js contém as definições de rotas para diferentes partes da aplicação, como admin e tecnico

const rotas = require('./routes/rotas');

// const app é a instância do aplicativo Express
// express() cria uma nova aplicação Express

const app = express();

// PORT é a porta na qual o servidor irá escutar as requisições
// process.env.PORT obtém a porta do ambiente, ou usa 5000 como padrão
const PORT = process.env.PORT || 5000;

//app.use é usado para montar o middleware no aplicativo Express
// express.json() é um middleware que analisa requisições com payload JSON
// cors() é um middleware que habilita o CORS na aplicação
app.use(express.json());

//applica o middleware CORS a todas as rotas da aplicação
//app.use(cors()) habilita o CORS para todas as rotas da aplicação
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
//sequelize.sync() sincroniza todos os modelos definidos com o banco de dados
// force: false garante que as tabelas não sejam recriadas a cada reinício do servidor

    // .then() é chamado quando a sincronização é bem-sucedida
    .then(() => {
        console.log('Banco de dados PostgreSQL conectado e sincronizado com Sequelize.');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })

    // .catch() é chamado quando há um erro na sincronização
    .catch(err => {
        console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
        process.exit(1);
    });
