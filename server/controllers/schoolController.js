const School = require('../models/School');
const { ForeignKeyConstraintError } = require('sequelize');

// Função para criar uma nova escola (apenas Admin)
exports.createSchool = async (req, res) => {
    try {
        const newSchool = await School.create(req.body);
        res.status(201).json({ 
            message: 'Escola criada com sucesso.', 
            school: newSchool 
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'O nome ou email/cnpj desta escola já está em uso.' });
        }
        console.error('Erro ao criar escola:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para listar todas as escolas (necessário para os dropdowns de Usuário/Equipamento)
exports.getAllSchools = async (req, res) => {
    try {
        const schools = await School.findAll({
            attributes: ['id', 'nome', 'endereco', 'telefone', 'email', 'cnpj'] 
        });
        res.status(200).json(schools);
    } catch (error) {
        console.error('Erro ao buscar escolas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para obter uma escola por ID
exports.getSchoolById = async (req, res) => {
    try {
        const school = await School.findByPk(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'Escola não encontrada.' });
        }
        res.status(200).json(school);
    } catch (error) {
        console.error('Erro ao buscar escola por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para atualizar uma escola (apenas Admin)
exports.updateSchool = async (req, res) => {
    try {
        const school = await School.findByPk(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'Escola não encontrada.' });
        }

        await school.update(req.body);
        res.status(200).json({ message: 'Escola atualizada com sucesso.', school });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'O nome ou email/cnpj desta escola já está em uso.' });
        }
        console.error('Erro ao atualizar escola:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para deletar uma escola (apenas Admin)
exports.deleteSchool = async (req, res) => {
    try {
        const school = await School.findByPk(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'Escola não encontrada.' });
        }

        await school.destroy();
        res.status(200).json({ message: 'Escola removida com sucesso.' });
    } catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
             return res.status(400).json({ message: 'Não é possível remover a escola. Existem usuários, equipamentos ou tickets associados a ela.' });
        }
        console.error('Erro ao deletar escola:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
