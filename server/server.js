// ==== Importações ====
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');//importa o framework Express para criar o servidor web 
//express é um framework web para Node.js que facilita a criação de servidores e APIs
const cors = require('cors'); //cors é um middleware para habilitar CORS (Cross-Origin Resource Sharing) em aplicações Express
// CORS é um mecanismo que permite que recursos restritos em uma página web sejam solicitados a partir de outro domínio fora do domínio do qual o recurso foi servido
const path = require('path');//path é um módulo nativo do Node.js que fornece utilitários para trabalhar com caminhos de arquivos e diretórios
const sequelize = require('./config/database');// Importa a instância do Sequelize configurada para conectar ao banco de dados
// Importa as associações entre os modelos (se houver)
const associations = require('./models/associations');// Importa as associações entre os modelos (se houver)
// Importa a função para criar um usuário admin se não existir
const criarAdminSeNaoExistir = require('./seeds/criarAdmin.js');  // Função para criar um usuário admin se não existir
// Importa as rotas da aplicação
const authRoutes = require('./routes/auth');// Rotas de autenticação 
// Rotas de autenticação (login, registro, etc.)
const rotas = require('./routes/rotas'); // Outras rotas da aplicação
const ticketRoutes = require('./routes/ticketRoutes');// Rotas relacionadas a chamados (tickets)
const userRoutes = require('./routes/userRoutes');// Rotas relacionadas a usuários (atualização de perfil, etc.)
const equipmentRoutes = require('./routes/equipmentRoutes'); // Rotas relacionadas a equipamentos


// ==== Inicialização do Servidor Express ====
    const app = express();
    const PORT = process.env.PORT || 5000;


// ==== Middlewares ====
//middleware é uma função que tem acesso ao objeto de solicitação (req), ao objeto de resposta (res) e à próxima função de middleware no ciclo de solicitação-resposta da aplicação
// Esses middlewares devem ser os primeiros a serem usados
// Eles processam as requisições antes que cheguem às rotas
app.use(express.json()); 
app.use(cors());
// Use as rotas de equipamentos
app.use('/api/equipments', equipmentRoutes);  

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// ==== Rotas da API ====
// Rota para a tela de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'front', 'login', 'login.html'));
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de chamados (tickets)

app.use('/api/tickets', ticketRoutes);

// Rotas de usuários
app.use('/api/users', userRoutes); 

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

