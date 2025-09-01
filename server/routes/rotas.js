
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

const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario'); 
const Escola = require('../models/School'); // seu model de escolas


// ==================== ADMIN PAINEL ====================
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


// ==================== CRUD DE USUÁRIOS ====================
// Listar usuários (sem senha)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['senha'] } });
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Criar usuário

router.post('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin')
      return res.status(403).json({ error: 'Acesso negado' });

    const { nome, email, senha, role, schoolId } = req.body;
    if (!nome || !email || !senha || !role)
      return res.status(400).json({ error: 'Campos incompletos' });

    const exists = await Usuario.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email já cadastrado' });

    // Busca a escola padrão
    const escolaPadrao = await Escola.findOne({ where: { nome: 'NIT RPT' } });
    if (!escolaPadrao)
      return res.status(500).json({ error: 'Escola padrão não encontrada' });

    let assignedSchoolId;

    if (role === 'admin' || role === 'technician') {
      assignedSchoolId = escolaPadrao.id; // usa escola padrão
    } else if (role === 'client') {
      if (!schoolId) {
        // Se não enviou schoolId, retorna lista de escolas
        const escolas = await Escola.findAll({ attributes: ['id', 'nome'] });
        return res.status(400).json({
          error: 'Selecione uma escola',
          escolas
        });
      }
      assignedSchoolId = schoolId; // usa a escola selecionada
    }
    

    const hash = await bcrypt.hash(senha, 10);
    const novo = await Usuario.create({
      nome,
      email,
      senha: hash,
      role,
      schoolId: assignedSchoolId
    });

    const { senha: _, ...ret } = novo.toJSON();
    res.status(201).json(ret);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Editar usuário (nome/email/tipo)
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') return res.status(403).json({ error: 'Acesso negado' });

    const { id } = req.params;
    const { nome, email, role } = req.body;

    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    user.nome = nome ?? user.nome;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    await user.save();

    const { senha: _, ...ret } = user.toJSON();
    res.json(ret);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Atualizar senha
router.patch('/users/:id/password', authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') return res.status(403).json({ error: 'Acesso negado' });

    const { id } = req.params;
    const { senha } = req.body;
    if (!senha) return res.status(400).json({ error: 'Senha obrigatória' });

    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    user.senha = await bcrypt.hash(senha, 10);
    await user.save();

    res.json({ message: 'Senha atualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

// Deletar usuário
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo_usuario !== 'admin') return res.status(403).json({ error: 'Acesso negado' });

    const { id } = req.params;
    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    await user.destroy();
    res.json({ message: 'Usuário removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});



// ==================== TECNICO ====================
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

// ==================== Escola ====================
//Criar nova escola
router.post('/schools', authMiddleware, async (req, res) => {
  try {
      const { nome, endereco, telefone, email } = req.body;
      if (!nome || !endereco || !telefone || !email) {
          return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const escolaExistente = await Escola.findOne({ where: { nome } });
      if (escolaExistente) {
          return res.status(400).json({ error: `Escola ${nome} já existe.` });
      }

      const school = await Escola.create({ nome, endereco, telefone, email });
      res.status(201).json(school);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
});

// Listar escolas (para preencher dropdown do usuário)
router.get('/schools', authMiddleware, async (req, res) => {
  try {
    const escolas = await Escola.findAll({ attributes: ['id', 'nome'] });
    res.json(escolas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
});

module.exports = router;