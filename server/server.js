//Foram realizadas as seguintes instalações de pacotes:
//express, sequelize, pg, pg-hstore, dotenv, cors, bcryptjs, jsonwebtoken
//Para instalar, execute o seguinte comando no terminal:        
//npm install express sequelize pg pg-hstore dotenv cors bcryptjs jsonwebtoken
//express é o framework web para Node.js
//sequelize é um ORM para Node.js que facilita a interação com bancos de dados SQL
//pg e pg-hstore são pacotes necessários para conectar o Sequelize ao PostgreSQL
//dotenv é usado para carregar variáveis de ambiente de um arquivo .env
// cors é usado para habilitar CORS (Cross-Origin Resource Sharing) no servidor
//bcryptjs é usado para criptografar senhas    
//jsonwebtoken é usado para criar e verificar tokens JWT para autenticação
//Certifique-se de ter um banco de dados PostgreSQL rodando e configurado corretamente  

//dotenv é usado para carregar variáveis de ambiente de um arquivo .env
//Certifique-se de ter um arquivo .env configurado com as variáveis necessárias
//O arquivo .env deve conter as seguintes variáveis:   
//DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
require('dotenv').config();

// Importando os módulos necessários
//  Para este exemplo, vamos usar o Express para criar o servidor,
//  Sequelize para interagir com o banco de dados PostgreSQL e CORS para permitir requisições de diferentes origens.
//  Certifique-se de ter o PostgreSQL instalado e rodando, e que as variáveis de ambiente estejam configuradas corretamente

const express = require('express');

//cors é usado para habilitar CORS (Cross-Origin Resource Sharing) no servidor

const cors = require('cors');

//sequelize é um ORM para Node.js que facilita a interação com bancos de dados SQL
const sequelize = require('./config/database');

//app é uma instância do Express que será usada para definir rotas e middleware
//rotas são os caminhos que o servidor irá responder
//middleware são funções que processam as requisições antes de chegar às rotas
const app = express();

//PORT é a porta em que o servidor irá rodar, podendo ser definida por uma variável
//de ambiente ou, se não definida, será a porta 5000
//Certifique-se de que a variável de ambiente PORT esteja definida no seu arquivo .env
const PORT = process.env.PORT || 5000;

// Configurando o middleware do Express
// express.json() é usado para analisar o corpo das requisições em formato JSON

app.use(express.json());

// cors() é usado para habilitar CORS, permitindo que o servidor aceite requisições de diferentes origens
app.use(cors());

// Definindo uma rota de teste para verificar se o servidor está funcionando
// Quando uma requisição GET for feita para a raiz ('/'), o servidor irá responder com  uma mensagem simples
// Isso é útil para verificar se o servidor está rodando corretamente
//req é o objeto de requisição que contém informações sobre a requisição feita pelo cliente
//res é o objeto de resposta que será enviado de volta ao cliente     
app.get('/', (req, res) => {
    res.send('API do HelpDeskSphere está online e funcionando!');
});

// sequelize.sync() é usado para sincronizar o modelo do Sequelize com o banco de dados
// force: false significa que não iremos apagar os dados existentes no banco de dados
// Se você quiser apagar os dados existentes e recriar as tabelas, mude para force: true
sequelize.sync({ force: false })
    .then(() => {
        // Conexão bem-sucedida com o banco de dados
        // Após a sincronização, o servidor Express será iniciado na porta definida
        // console.log é usado para imprimir mensagens no console, útil para depuração
        // Aqui, estamos informando que o banco de dados foi conectado e sincronizado com sucesso
        console.log('Banco de dados PostgreSQL conectado e sincronizado com Sequelize.');

        // Iniciando o servidor Express na porta definida
        // app.listen() é usado para iniciar o servidor e escutar requisições na porta
        // port é a porta em que o servidor irá rodar, definida anteriormente
        // () => {} é uma função de callback que será executada quando o servidor estiver pronto para receber requisições
        // Dentro dessa função, estamos imprimindo uma mensagem no console informando que o servidor está rodando
        //neste caso, estamos usando a variável PORT para definir a porta
        //  Isso permite que o servidor seja iniciado na porta especificada, seja ela definida por uma variável de ambiente ou a porta padrão 5000
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })

    // Se ocorrer um erro ao conectar ou sincronizar o banco de dados, o erro será capturado e uma mensagem de erro será exibida no console
    // process.exit(1) é usado para encerrar o processo Node.js com um código de erro
    // Isso é útil para evitar que o servidor continue rodando se não conseguir se conectar ao banco de dados   
    //  Isso é importante para garantir que o servidor não fique rodando sem uma conexão válida com o banco de dados
    .catch(err => {
        console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
        process.exit(1);
    });