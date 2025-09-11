// userController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Função para listar todos os usuários (apenas para admins)
exports.getAllUsers = async (req, res) => {
        try {  
            //Busca todos os usuários no banco de dados, excluindo a senha
            const users = await Usuario.findAll({
             //const users é uma variável que armazena a lista de usuários retornada pela consulta ao banco de dados
             //await é usado para esperar a resolução da promessa retornada por Usuario.findAll
            attributes: { exclude: ['senha'] } // Exclui o campo de senha dos resultados
         });
        res.status(200).json(users); // Retorna a lista de usuários
    } catch (error) {
         console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Função para atualizar um usuário existente
exports.updateUser = async (req, res) => {
    try {
        // Pega o ID do usuário da URL e os dados do corpo da requisição
        const userId = req.params.id;
        const { nome, email, senha, role, schoolId } = req.body;

        // VERIFICAÇÃO DE PERMISSÃO:
        // O usuário logado só pode atualizar seu próprio perfil, a menos que seja um admin.
        if (req.user.id !== userId && req.user.role !== 'admin') {// Se o ID do usuário logado não for igual ao ID do usuário a ser atualizado e ele não for admin
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar este usuário.' });
        }

        const user = await Usuario.findByPk(userId);// Busca o usuário no banco de dados pelo ID
        if (!user) {// Se o usuário não for encontrado
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Prepara os dados para atualização, incluindo a criptografia da senha
        const updates = {};// Objeto para armazenar os campos a serem atualizados
        if (nome) updates.nome = nome;
        if (email) updates.email = email;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            updates.senha = await bcrypt.hash(senha, salt);
        }
        if (role && req.user.role === 'admin') { // Apenas um admin pode alterar a role
            updates.role = role;
        }
        if (schoolId) updates.schoolId = schoolId;

        // Atualiza o usuário no banco de dados
        await user.update(updates);

        res.status(200).json({ message: 'Usuário atualizado com sucesso.' });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


// Função para obter um usuário pelo ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Pega o ID da URL

        // VERIFICAÇÃO DE PERMISSÃO:
        // O usuário logado só pode ver seu próprio perfil, a menos que seja um admin.
        if (req.user.id!== userId && req.user.role!== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para visualizar este usuário.' });
        }

        // Busca o usuário no banco de dados
        const user = await Usuario.findByPk(userId, {
            attributes: { exclude: ['senha'] } // Exclui a senha por segurança
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


// Função para remover um usuário
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // VERIFICAÇÃO DE PERMISSÃO:
        // O usuário logado só pode deletar seu próprio perfil, a menos que seja um admin.
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para remover este usuário.' });
        }

        // Busca o usuário no banco de dados para verificar se ele existe
        const user = await Usuario.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Remove o usuário do banco de dados
        await user.destroy();

        res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};