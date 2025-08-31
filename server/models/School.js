// Importa os tipos de dados do Sequelize e a instância de conexão
//Datatypes é  usado para definir os tipos de dados dos campos do modelo
const { DataTypes } = require('sequelize');
//sequelize é a instância de conexão com o banco de dados
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
// Importa o modelo Equipment para definir a relação
//const Equipment é o modelo que representa a entidade Equipment no banco de dados
// require('./Equipment') importa o modelo Equipment do arquivo Equipment.js



const School = sequelize.define('School', { // Define o modelo School
    id: {   // Define o campo id
        type: DataTypes.UUID,// Define o tipo como UUID UUID é um identificador único universal
        defaultValue: DataTypes.UUIDV4,// Gera um UUID automaticamente
        primaryKey: true,// Define como chave primária
        allowNull: false,// Torna o campo obrigatório
    },
    nome: { // Define o campo nome
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
        unique: true,// Define como único
    },
    endereco: { // Define o campo endereco  
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
    },  
    telefone: { // Define o campo telefone
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório  
    },
    email: { // Define o campo email
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: false,// Torna o campo obrigatório
        unique: true,// Define como único
    },
    cnpj: { // Define o campo cnpj
        type: DataTypes.STRING,// Define o tipo como STRING
        allowNull: true,// Torna o campo cnpj opcional
        unique: true,// Define como único
    }
}, {
  

    tableName: 'Schools', // Define o nome da tabela como 'Schools'
});
    // A associação inversa é definida no modelo User,mas é uma boa Prática definir o nome da tabela aqui também
    //ter a definição aqui também para clareza

    // Define a relação entre School e Usuario

    
    module.exports = School;
    // Exporta o modelo School para ser usado em outros arquivos