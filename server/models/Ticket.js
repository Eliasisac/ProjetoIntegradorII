// Importa os tipos de dados do Sequelize e a instância de conexão
//Datatypes é  usado para definir os tipos de dados dos campos do modelo
const { DataTypes } = require('sequelize');
//sequelize é a instância de conexão com o banco de dados
const sequelize = require('../config/database');
//importa o modelo Equipment para definir a relação
//const Equipment é o modelo que representa a entidade Equipment no banco de dados
// require('./Equipment') importa o modelo Equipment do arquivo Equipment.js    
const Equipment = require('./Equipment');
const Usuario = require('./Usuario');
// Importa o modelo Equipment para definir a relação
//const Equipment é o modelo que representa a entidade Equipment no banco de dados
// require('./Equipment') importa o modelo Equipment do arquivo Equipment.js
const School = require('./School');
// Importa o modelo School para definir a relação
//const School é o modelo que representa a entidade School no banco de dados
// require('./School') importa o modelo School do arquivo School.js

// Define o modelo Ticket
const Ticket = sequelize.define('Ticket', {// Define o modelo Ticket
    id: {// Define o campo id
        type: DataTypes.UUID,// Define o tipo como UUID
        defaultValue: DataTypes.UUIDV4,// Gera um UUID automaticamente
        primaryKey: true,// Define como chave primária
        allowNull: false,// Torna o campo obrigatório
    },
    titulo: {       // Define o campo titulo
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório

    },  
    descricao: {    // Define o campo descricao
        type: DataTypes.TEXT,// Define o tipo como TEXT
        allowNull: false,// Torna o campo obrigatório
    },
    status: {      // Define o campo status
        type: DataTypes.ENUM('aberto', 'em andamento', 'resolvido','fechado'),// Define o tipo como ENUM, Enum é um tipo de dado que permite apenas valores pré-definidos   
        defaultValue: 'aberto',// Define o valor padrão como 'aberto'
        allowNull: false,// Torna o campo obrigatório
    },
    prioridade: {  // Define o campo prioridade
        type: DataTypes.ENUM('baixa', 'media', 'alta'),// Define o tipo como ENUM
        defaultValue: 'media',// Define o valor padrão como 'media'
        allowNull: false,// Torna o campo obrigatório
    },

    //chave estrangeira para o usuário que criou o ticket
    usuarioId: {
        type: DataTypes.UUID, // Define o tipo como UUID  UUID é um identificador único universal
        allowNull: false, // Torna o campo obrigatório
        references: {
            model: 'Usuarios', // Referencia o modelo Usuario
            key: 'id', // Referencia a chave primária do modelo Usuario
        }
    },
    //chave estrangeira para o técnico atribuído ao ticket 
    tecnicoId: {
        type: DataTypes.UUID, // Define o tipo como UUID  UUID é um identificador único universal
        allowNull: true, // Torna o campo opcional
        references: {
            model: 'Usuarios', // Referencia o modelo Usuario
            key: 'id', // Referencia a chave primária do modelo Usuario
        }
    },
    //Chave estrangeira para a escola associada ao ticket
    schoolId: {
        type: DataTypes.UUID, // Define o tipo como UUID  UUID é um identificador único universal
        allowNull: false, // Torna o campo obrigatório
        references: {
            model: 'Schools', // Referencia o modelo School
            key: 'id', // Referencia a chave primária do modelo School
        }
    },
    //chave estrangeira que referencia o equipamento associado ao ticket
    equipmentId: {
        type: DataTypes.UUID, // Define o tipo como UUID  UUID é um identificador único universal    
        allowNull: true, // Torna o campo opcional
        references: {
            model: 'Equipments', // Referencia o modelo Equipment
            key: 'id', // Referencia a chave primária do modelo Equipment
        }
    },
}, {    

    //Opções adicionais do modelo
    tableName: 'Tickets', // Define o nome da tabela como 'Tickets
    //creatdAT e updateAT são gerenciados automaticamente pelo Sequelize
})

    //Define as associações do modelo Ticket



//Exporta o modelo Ticket para uso em outras partes da aplicação
module.exports = Ticket;
// Ticket é o modelo que representa a entidade Ticket no banco de dados
// module.exports = Ticket exporta o modelo Ticket para uso em outras partes da aplicação
// require('./Ticket') importa o modelo Ticket do arquivo Ticket.js 
