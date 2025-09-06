// userController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

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
