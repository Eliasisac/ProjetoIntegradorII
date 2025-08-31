// Importa os tipos de dados necessários do Sequelize.
const { DataTypes } = require('sequelize');

// Importa a instância do Sequelize para conexão com o banco de dados.
const sequelize = require('../config/database');

/**
 * @model Ticket
 * @description Define o modelo para a tabela 'tickets', que armazena informações sobre os chamados de suporte.
 */
const Ticket = sequelize.define('Ticket', {
    /**
     * @property {UUID} id - Identificador único do ticket.
     * @description Gerado automaticamente como um UUIDV4. É a chave primária da tabela.
     */
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    /**
     * @property {string} titulo - Título breve do ticket.
     */
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * @property {string} descricao - Descrição detalhada do problema ou solicitação.
     */
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    /**
     * @property {ENUM} status - Status atual do ticket.
     * @description Pode ser 'aberto', 'em andamento', 'resolvido' ou 'fechado'. O valor padrão é 'aberto'.
     */
    status: {
        type: DataTypes.ENUM('aberto', 'em andamento', 'resolvido', 'fechado'),
        defaultValue: 'aberto',
        allowNull: false,
    },
    /**
     * @property {ENUM} prioridade - Nível de urgência do ticket.
     * @description Pode ser 'baixa', 'media' ou 'alta'. O valor padrão é 'media'.
     */
    prioridade: {
        type: DataTypes.ENUM('baixa', 'media', 'alta'),
        defaultValue: 'media',
        allowNull: false,
    },
    /**
     * @property {UUID} usuarioId - Chave estrangeira que referencia o ID do usuário que abriu o ticket.
     */
    usuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    /**
     * @property {UUID} tecnicoId - Chave estrangeira que referencia o ID do técnico atribuído ao ticket.
     * @description Pode ser nulo se nenhum técnico foi atribuído ainda.
     */
    tecnicoId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    /**
     * @property {UUID} schoolId - Chave estrangeira que referencia o ID da escola relacionada ao ticket.
     */
    schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    /**
     * @property {UUID} equipmentId - Chave estrangeira que referencia o ID do equipamento relacionado ao ticket.
     * @description Pode ser nulo se o ticket não estiver associado a um equipamento específico.
     */
    equipmentId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    // Opções do modelo
    tableName: 'tickets', // Define explicitamente o nome da tabela no banco de dados.
});

// Exporta o modelo Ticket para ser utilizado em outras partes da aplicação.
module.exports = Ticket;
