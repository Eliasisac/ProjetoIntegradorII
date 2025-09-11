// controllers/equipmentController.js
const Equipment = require('../models/Equipment');

exports.createEquipment = async (req, res) => {
    try {
        const {name,brand,model, status,schoolId,type} = req.body;

        if (!name || !schoolId) {//se nome ou schoolId não forem fornecidos
            return res.status(400).json({ message: ' nome e ID da escola são obrigatórios.' });
        }

        const newEquipment = await Equipment.create({
            name,
            brand,
            model,
            status,
            schoolId,
            type
        });

        res.status(201).json({ 
            message: 'Equipamento criado com sucesso.', 
            equipment: newEquipment 
        });

    } catch (error) {
        console.error('Erro ao criar equipamento:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


// Função para listar todos os equipamentos
exports.getAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.findAll();
        
        console.log('Lista de equipamentos solicitada.');

        res.status(200).json(equipments);
    } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


// Função para atualizar um equipamento
exports.updateEquipment = async (req, res) => {
    try {
        const equipmentId = req.params.id;
        const { name, brand, model, status, schoolId, type } = req.body;

        // Busca o equipamento no banco
        const equipment = await Equipment.findByPk(equipmentId);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipamento não encontrado.' });
        }

        // Atualiza os campos recebidos
        await equipment.update({
            name: name || equipment.name,
            brand: brand || equipment.brand,
            model: model || equipment.model,
            status: status || equipment.status,
            schoolId: schoolId || equipment.schoolId,
            type: type || equipment.type
        });

        res.status(200).json({ 
            message: 'Equipamento atualizado com sucesso.', 
            equipment 
        });
    } catch (error) {
        console.error('Erro ao atualizar equipamento:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Função para excluir um equipamento
exports.deleteEquipment = async (req, res) => {
    try {
        const equipmentId = req.params.id;

        // Busca o equipamento no banco
        const equipment = await Equipment.findByPk(equipmentId);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipamento não encontrado.' });
        }

        // Remove do banco
        await equipment.destroy();

        res.status(200).json({ message: 'Equipamento removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover equipamento:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};
