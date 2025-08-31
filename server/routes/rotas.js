
const express = require('express');

//express é o framework web usado para criar rotas e gerenciar requisições HTTP
//require('express') importa o módulo express

const router = express.Router();
//router é o objeto que define as rotas da aplicação
//express.Router() cria uma nova instância de roteador

const authMiddleware = require('./authMiddleware');
//authMiddleware é o middleware de autenticação que verifica o token JWT
//require('./authMiddleware') importa o middleware de autenticação do arquivo authMiddleware.js

const path = require('path');
//path é o módulo nativo do Node.js usado para manipular caminhos de arquivos e diretórios
//require('path') importa o módulo path

// Admin
router.get('/admin', authMiddleware, (req, res) => {
  //router.get define uma rota GET para o caminho /admin
  //authMiddleware é o middleware que protege a rota, verificando o token JWT
  // (req, res) => { ... } é a função que lida com a requisição e resposta
  //req é o objeto de requisição que contém informações sobre a requisição HTTP
  //res é o objeto de resposta que é usado para enviar a resposta HTTP
  console.log('Usuário autenticado:', req.user);
  // Imprime no console as informações do usuário autenticado
  if (req.user.tipo_usuario !== 'admin') return res.status(403).send('Acesso negado');
  // Verifica se o tipo de usuário é 'admin'
  // Se não for, retorna 403 (Forbidden) com a mensagem 'Acesso negado'
  // Se for, envia o arquivo index.html da pasta admin como resposta
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'front', 'admin', 'index.html'));
  //res.sendFile envia um arquivo como resposta
  //path.join(...) cria o caminho absoluto para o arquivo index.html da pasta admin
  //__dirname é a variável que contém o diretório atual do arquivo rotas.js
  // '..', '..', 'public', 'front', 'admin', 'index.html' navega até o arquivo index.html
});

router.get('/tecnico', authMiddleware, (req, res) => {
  // Rota GET para /tecnico protegida pelo middleware de autenticação
 
  // Se não for, retorna 403 (Forbidden) com a mensagem 'Acesso negado'
  
  console.log('Usuário autenticado:', req.user);
  if (req.user.tipo_usuario !== 'tecnico') return res.status(403).send('Acesso negado');
   // Verifica se o usuário autenticado é do tipo 'tecnico'
  // Se for, envia o arquivo index.html da pasta tecnico como resposta
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'front', 'tecnico', 'index.html'));
  //res.sendFile envia um arquivo como resposta
  //path.join(...) cria o caminho absoluto para o arquivo index.html da pasta tecnico
  //__dirname é a variável que contém o diretório atual do arquivo rotas.js
  // '..', '..', 'public', 'front', 'tecnico', 'index.html' navega até o arquivo index.html
  
});


module.exports = router;