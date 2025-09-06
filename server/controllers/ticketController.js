const Ticket = require('../models/Ticket');
const Usuario = require('../models/Usuario');
const School = require('../models/School');
const Equipment = require('../models/Equipment');
// server/controllers/ticketController.js
// Controlador para gerenciar operações relacionadas a chamados (tickets)
// Importa os modelos necessários do Sequelize
//  Ticket é o modelo do Sequelize para a tabela de chamados
//  Usuario é o modelo do Sequelize para a tabela de usuários
//  School é o modelo do Sequelize para a tabela de escolas
//  Equipment é o modelo do Sequelize para a tabela de equipamentos
// require('../models') importa o índice dos modelos, que geralmente exporta todos os modelos definidos


//exports.createTicket = async (req, res) => { ... } é a função que lida com a criação de novos chamados
// Ela recebe os dados do chamado via req.body, cria o chamado no banco de dados e retorna os detalhes do chamado criado
// A função é assíncrona para lidar com operações de banco de dados que são baseadas em promessas
//req e res são os objetos de solicitação e resposta do Express.js
// req.body contém os dados enviados pelo cliente (título, descrição, prioridade, equipmentId)

exports.createTicket = async (req, res) => {//req e res são os objetos de solicitação e resposta do Express.js

    try {
        // Pega o ID do usuário autenticado do token (isso será feito pelo middleware)//middleware é que adiciona o objeto user ao req
        // Assumimos que o middleware de autenticação adiciona req.user com as informações do usuário autenticado
        // userId e schoolId são extraídos do objeto req.user
         //req.user é definido no middleware de autenticação

        // Extrai os dados do chamado do corpo da requisição
        // titulo, descricao, prioridade e equipmentId são extraídos de req.body
        const { titulo, descricao, prioridade, equipmentId } = req.body;
         console.log('Dados do usuário a partir do token:', {
            usuarioId: req.user.id,
            schoolId: req.user.schoolId 
        });          
        // Verificação adicional, caso necessário
        if (!titulo || !descricao) {// Verifica se título e descrição foram fornecidos
            return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
        }

        const newTicket = await Ticket.create({// Cria um novo chamado no banco de dados
            titulo,// Atribui o título do chamado
            descricao,//    Atribui a descrição do chamado
            status: 'aberto', // Define o status inicial
            prioridade,// Atribui a prioridade do chamado
            usuarioId: req.user.id, // Atribui o ID do usuário logado
            schoolId: req.user.schoolId , // Atribui o ID da escola do usuário logado
            equipmentId: equipmentId || null,// Atribui o ID do equipamento, se fornecido, ou null
        });

        res.status(201).json({ 
            message: 'Chamado criado com sucesso.', 
            ticket: newTicket 
        });

    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};