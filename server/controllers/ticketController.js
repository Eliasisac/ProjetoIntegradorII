console.log('Arquivo ticketController.js carregado com sucesso.'); // ADICIONE ESTA LINHA!

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

// Função para atualizar um ticket (atribuir a um técnico, alterar status, etc.)
exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID do ticket da URL
        const { titulo, descricao, prioridade, status, tecnicoId } = req.body; // Pega os dados a serem atualizados

        // Busca o ticket pelo ID
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }

        // Atualiza os campos do ticket com os dados fornecidos
        await ticket.update({
            titulo: titulo || ticket.titulo, // Se o título for fornecido, atualiza; caso contrário, mantém o atual
            descricao: descricao || ticket.descricao,
            prioridade: prioridade || ticket.prioridade,
            status: status || ticket.status,
            tecnicoId: tecnicoId || ticket.tecnicoId, // Atribui um novo técnico, se fornecido
        });

        res.status(200).json({
            message: 'Chamado atualizado com sucesso.',
            ticket
        });

    } catch (error) {
        console.error('Erro ao atualizar chamado:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para buscar um ticket por ID, incluindo verificações de permissão
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca o ticket pelo ID, incluindo os dados do usuário associado
        const ticket = await Ticket.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'criador',
                attributes: ['id', 'nome', 'email', 'role']
            }, {
                model: Usuario,
                as: 'responsavel',
                attributes: ['id', 'nome', 'email', 'role']
            }]
        });

        // Se o ticket não for encontrado, retorna 404
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket não encontrado.' });
        }

        // Verifica a permissão do usuário para ver o ticket
        const usuarioLogado = req.user;
        const isAdmin = usuarioLogado.role === 'admin';
        const isOwner = ticket.criadorId === usuarioLogado.id;
        const isResponsible = ticket.responsavelId === usuarioLogado.id;

        // Apenas admins, o criador ou o responsável podem ver o ticket
        if (!isAdmin && !isOwner && !isResponsible) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para visualizar este ticket.' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error('Erro ao buscar ticket:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};