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