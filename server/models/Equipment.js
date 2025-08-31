//Importa os tipos de dados do Sequelize e a instância de conexão
//Datatypes é  usado para definir os tipos de dados dos campos do modelo
const { DataTypes } = require('sequelize');
//sequelize é a instância de conexão com o banco de dados
const sequelize = require('../config/database');

//Importa os modelos School e Ticket para definir as relações
//const School é o modelo que representa a entidade School no banco de dados
// require('./School') importa o modelo School do arquivo School.js
const School = require('./School');

//const Ticket é o modelo que representa a entidade Ticket no banco de dados
// require('./Ticket') importa o modelo Ticket do arquivo Ticket.js
const Ticket = require('./Ticket');
// Define o modelo Equipment
const Equipment = sequelize.define('Equipment', { // Define o modelo Equipment
    id: {   // Define o campo id
        type: DataTypes.UUID,// Define o tipo como UUID UUID é um identificador único universal 
        defaultValue: DataTypes.UUIDV4,// Gera um UUID automaticamente
        primaryKey: true,// Define como chave primária
        allowNull: false,// Torna o campo obrigatório
    },
    name: { // Define o campo nome  
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
        unique:false,// Define como não único
    },
    brand: { // Define o campo marca  
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
    },
    model: { // Define o campo modelo  
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
    },
    status: { // Define o campo status  
        type: DataTypes.ENUM('ativo', 'inativo', 'manutencao','descartado'),// Define o tipo como ENUM, Enum é um tipo de dado que permite apenas valores pré-definidos
        defaultValue: 'ativo',// Define o valor padrão como 'ativo'
        allowNull: false,// Torna o campo obrigatório
    },
    //chave estrangeira para a escola à qual o equipamento pertence
    schoolId: {
        type: DataTypes.UUID, // Define o tipo como UUID  UUID é um identificador único universal
        allowNull: false, // Torna o campo obrigatório  
        references: {
            model: School, // Referencia o modelo School  
            key: 'id', // Referencia a chave primária do modelo School
        }
    },
    type: { // Define o campo tipo  
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
    },
}, {
    tableName: 'Equipments', // Define o nome da tabela como 'Equipments'
});
// Define a relação entre Equipment e School
