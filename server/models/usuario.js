// Importa os tipos de dados do Sequelize e a instância de conexão
//Datatypes é  usado para definir os tipos de dados dos campos do modelo
const { DataTypes } = require('sequelize');
//sequelize é a instância de conexão com o banco de dados
const sequelize = require('../config/database');


// Importa o modelo School para definir a relação
//const School é o modelo que representa a entidade School no banco de dados
// require('./School') importa o modelo School do arquivo School.js

const School = require('./School');
// Define o modelo Usuario
const Usuario = sequelize.define('Usuario', {

  id: {   
    type: DataTypes.UUID,// Define o tipo como UUID
    defaultValue: DataTypes.UUIDV4,// Gera um UUID automaticamente
    primaryKey: true,// Define como chave primária
    allowNull: false,// Torna o campo obrigatório
  },
  nome: {
    type: DataTypes.STRING,// Define o tipo como STRING
    allowNull: false,// Torna o campo obrigatório
  },
  email: {
    type: DataTypes.STRING,// Define o tipo como STRING
    allowNull: false,// Torna o campo obrigatório
  },


  senha: {
    type: DataTypes.STRING,// Define o tipo como STRING
    allowNull: false,// Torna o campo obrigatório
  },
  role: {// Define o campo role 
  // role é o papel ou função do usuário no sistema
    type: DataTypes.ENUM('admin','client','technician'),// Define o tipo como ENUM
    allowNull: false,// Torna o campo obrigatório
    defaultValue: 'client'//  Define o valor padrão como 'client'
  },
  funcao: { // Define o campo funcao
   type: DataTypes.STRING,// Define o tipo como STRING
    allowNull: true,// Torna o campo funcao opcional
  },
  
   schoolId: {
      type: DataTypes.UUID, // Define o tipo como UUID  UUID é um identificador único universal
      allowNull: false, // Torna o campo obrigatório
      references: {
        model: School, // Referencia o modelo School  
        key: 'id', // Referencia a chave primária do modelo School
      }
    },
  },
{
  tableName: 'Usuario', // Define o nome da tabela como 'Usuarios'
});


// Define a relação entre Usuario e School


// Exporta o modelo Usuario para uso em outras partes da aplicação

module.exports = Usuario;
