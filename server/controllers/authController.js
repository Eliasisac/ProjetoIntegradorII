// const usuario é o modelo do Sequelize para a tabela de usuários
// bcrypt é usado para criptografar senhas
// jwt é usado para criar tokens de autenticação
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Adicione esta chave secreta para assinar os tokens (crie uma complexa e armazene no .env futuramente)
const JWT_SECRET = 'sua_chave_secreta_aqui';

// Lógica de registro de usuário
//exports.register = async (req, res) é a função que lida com o registro de novos usuários
// Ela recebe os dados do usuário via req.body, verifica se o email já está em uso,
// criptografa a senha, cria o usuário no banco de dados e retorna um token JWT
// para autenticação futura.
// A função é assíncrona para lidar com operações de banco de dados e criptografia que são baseadas em promessas.
//req e res são os objetos de solicitação e resposta do Express.js
// req.body contém os dados enviados pelo cliente (nome, email, senha, role, schoolId)
exports.register = async (req, res) => {
    const { nome, email, senha, role, schoolId } = req.body;

    try {
        // Verifica se o usuário já existe
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria o novo usuário no banco de dados
        const newUser = await Usuario.create({
            nome,
            email,
            senha: hashedPassword,
            role,
            schoolId,
        });

        // Gera um token JWT para o novo usuário
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
            expiresIn: '1h', // Token expira em 1 hora
        });

        // Retorna os detalhes do usuário e o token
        // 201 indica que o recurso foi criado com sucesso
        // O token é retornado para que o usuário possa ser autenticado imediatamente após o registro
        // A senha não é retornada por razões de segurança
        res.status(201).json({
            message: 'Usuário registrado com sucesso.',
            user: {
                id: newUser.id,
                nome: newUser.nome,
                email: newUser.email,
                role: newUser.role,
                schoolId: newUser.schoolId,
            },
            token,
        });

    } catch (error) {
        console.error('Erro no registro do usuário:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// ... (código existente para imports e a função register)

// Lógica de login de usuário
// exports.login = async (req, res) é a função que lida com o login de usuários existentes
// Ela recebe o email e a senha via req.body, verifica se o usuário existe,
// compara a senha fornecida com a senha criptografada no banco de dados,
exports.login = async (req, res) => {
    // const { email, senha } = req.body; extrai o email e a senha do corpo da solicitação
    const { email, senha } = req.body;

    try {
        // Encontra o usuário pelo email
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // Compara a senha fornecida com a senha criptografada do banco de dados
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // Gera um token JWT para o usuário
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1h', // Token expira em 1 hora
        });

        res.status(200).json({
            message: 'Login realizado com sucesso.',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
            },
            token,
        });

    } catch (error) {
        console.error('Erro no login do usuário:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};