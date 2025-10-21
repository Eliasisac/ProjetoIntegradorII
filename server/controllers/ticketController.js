// controllers/ticketController.js

const Ticket = require('../models/Ticket');
const Usuario = require('../models/Usuario');
const School = require('../models/School');
const Equipment = require('..//models/Equipment');
const { Op, ForeignKeyConstraintError } = require('sequelize');

exports.createTicket = async (req, res) => {
    try {
        const { titulo, descricao, prioridade, equipmentId } = req.body;
        
        if (!titulo || !descricao) {
            return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
        }
        
        if (!req.user || !req.user.id || !req.user.schoolId) {
            console.error("ERRO (500): req.user incompleto para criar ticket.", req.user);
            return res.status(500).json({ message: 'Falha na autenticação: Dados do usuário (ID/Escola) não encontrados na sessão.' });
        }

        const newTicket = await Ticket.create({
            titulo,
            descricao,
            status: 'aberto',
            prioridade,
            usuarioId: req.user.id,
            schoolId: req.user.schoolId ,
            equipmentId: equipmentId || null,
        });

        res.status(201).json({ 
            message: 'Chamado criado com sucesso.', 
            ticket: newTicket 
        });
        
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
            console.error('ERRO SEQUELIZE ao criar ticket:', error.message);
            return res.status(400).json({ message: 'Erro de validação do banco de dados: ' + error.message });
        }
        console.error('Erro geral ao criar chamado:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, prioridade, status, tecnicoId, resolucao } = req.body;
        const usuarioLogado = req.user;

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }
        
        
        const isAdmin = usuarioLogado.role === 'admin';
        const isTechnician = usuarioLogado.role === 'technician';
        const isAssignedTechnician = ticket.tecnicoId === usuarioLogado.id;
        
        if (!isAdmin && !isTechnician && usuarioLogado.role !== 'client') {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar chamados.' });
        }
   

        let updates = { titulo, descricao, prioridade, status, resolucao };

        if (isTechnician) {
            
            if (tecnicoId === usuarioLogado.id) {
                updates.tecnicoId = usuarioLogado.id;
                
                if (ticket.status === 'aberto') {
                    updates.status = 'em andamento';
                }
                console.log(`Técnico ${usuarioLogado.id} aceitou/gerenciou o chamado ${id}`);
            } else if (tecnicoId && tecnicoId !== usuarioLogado.id) {
                 
                 return res.status(403).json({ message: 'Técnico pode apenas aceitar o chamado para si mesmo.' });
            }
            
            
            if (isAssignedTechnician || (tecnicoId === usuarioLogado.id)) {
                 updates = { 
                    ...updates, 
                    status: status || ticket.status, 
                    prioridade: prioridade || ticket.prioridade, 
                    resolucao: resolucao || ticket.resolucao 
                 };
            }
            
        } else if (usuarioLogado.role === 'client') {
             
             if (ticket.status !== 'aberto' || ticket.usuarioId !== usuarioLogado.id) {
                 return res.status(403).json({ message: 'Cliente só pode editar seu próprio chamado se estiver aberto.' });
             }
             updates = { titulo, descricao, prioridade }; 
        }
        
        
        if (isAdmin) {
            updates = { ...updates, tecnicoId: tecnicoId || ticket.tecnicoId };
        }


        
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
        
        await ticket.update(updates);

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

        const ticket = await Ticket.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'creator',
                attributes: ['id', 'nome', 'email', 'role', 'schoolId']
            }, {
                model: Usuario,
                as: 'technician',
                attributes: ['id', 'nome', 'email', 'role']
            }, {
                model: School,
                attributes: ['nome']
            }, {
                model: Equipment,
                as: 'Equipment',
                attributes: ['brand'] 
            }]
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket não encontrado.' });
        }

        // Verifica a permissão para visualizar
        const usuarioLogado = req.user;
        const isAdmin = usuarioLogado.role === 'admin';
        const isOwner = ticket.usuarioId === usuarioLogado.id;
        const isResponsible = ticket.tecnicoId === usuarioLogado.id;

        if (!isAdmin && !isOwner && !isResponsible) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para visualizar este ticket.' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error('Erro ao buscar ticket:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Função para deletar um ticket
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }

        
        const usuarioLogado = req.user;
        const isAdmin = usuarioLogado.role === 'admin';
        const isOwner = ticket.usuarioId === usuarioLogado.id && ticket.status === 'aberto';

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem excluir chamados em andamento ou o criador se estiver aberto.' });
        }

        await ticket.destroy();

        res.status(200).json({ message: 'Chamado removido com sucesso.' });
    } catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
            console.error('Erro de Chave Estrangeira ao deletar ticket:', error.message);
            return res.status(400).json({ message: 'Não é possível remover este chamado. Possui histórico de interações associado.' });
        }
        console.error('Erro ao remover chamado:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


exports.getAllTickets = async (req, res) => {
    try {
        const { status, prioridade, tecnicoId, page, limit, escolaId, fila } = req.query;
        const usuarioLogado = req.user;
        
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const offset = (pageNumber - 1) * pageSize;

        let filter = {};
        if (status) filter.status = status;
        if (prioridade) filter.prioridade = prioridade;
        
        if (usuarioLogado.role === 'client') {
            // Cliente só vê seus próprios chamados, da sua escola.
            filter.usuarioId = usuarioLogado.id;
            filter.schoolId = usuarioLogado.schoolId;

        } else if (usuarioLogado.role === 'technician') {
            
            if (fila === 'geral') {
                // Fila geral (abertos e não atribuídos) De todas as escolas
                filter.status = 'aberto';
                filter.tecnicoId = { [Op.is]: null }; 
            } else if (fila === 'meus') {
                // Meus chamados (atribuídos a ele) De todas as escolas
                filter.tecnicoId = usuarioLogado.id;
                filter.status = { [Op.ne]: 'fechado' }; // Não mostra fechados
            }
          
        } else if (usuarioLogado.role === 'admin') {
            
            if (escolaId) filter.schoolId = escolaId;
            if (tecnicoId) filter.tecnicoId = tecnicoId;
        }

        console.log('Filtros aplicados (Final):', filter);

        // Busca os tickets no banco de dados com filtros e paginação
        const { count, rows } = await Ticket.findAndCountAll({
            where: filter,
            limit: pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Usuario, as: 'creator', attributes: ['id', 'nome', 'email', 'role'] },
                { model: Usuario, as: 'technician', attributes: ['id', 'nome', 'email', 'role'] },
                { model: School, attributes: ['nome'] },
                { model: Equipment, as: 'Equipment', attributes: ['id', 'name', 'brand', 'model'] }
            ]
        });

        // Retorna a lista de tickets com metadados de paginação
        res.status(200).json({
            totalTickets: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: pageNumber,
            pageSize: pageSize,
            tickets: rows
        });

    } catch (error) {
        console.error('Erro ao buscar todos os tickets:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};