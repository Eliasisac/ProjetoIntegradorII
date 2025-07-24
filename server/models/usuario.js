// Importa os tipos de dados do Sequelize para definir os tipos das colunas do modelo.
const { DataTypes } = require('sequelize');
// Importa a instância do Sequelize, que representa a conexão com o banco de dados.
const sequelize = require('../config/database');

// Define o modelo 'Usuario', que será mapeado para uma tabela no banco de dados.
// O primeiro argumento é o nome do modelo. O segundo é um objeto que define os atributos (colunas).
const Usuario = sequelize.define('Usuario', {
  // Define a coluna 'id'.
  id: {
    type: DataTypes.INTEGER,    // O tipo de dado é um número inteiro.
    primaryKey: true,           // Esta coluna é a chave primária da tabela.
    autoIncrement: true,        // O valor será gerado e incrementado automaticamente pelo banco de dados.
  },
  // Define a coluna 'email'.
  email: {
    type: DataTypes.STRING,     // O tipo de dado é uma string (VARCHAR).
    allowNull: false,           // Esta coluna não pode ter valores nulos (NOT NULL).
    unique: true,               // Garante que todos os valores nesta coluna sejam únicos.
  },
  // Define a coluna 'senha'.
  senha: {
    type: DataTypes.STRING,     // O tipo de dado é uma string.
    allowNull: false,           // Esta coluna não pode ser nula.
  },
  // Define a coluna 'tipo_usuario' (ex: 'requerente', 'tecnico').
  tipo_usuario: {
    type: DataTypes.STRING,     // O tipo de dado é uma string.
    allowNull: false,           // Esta coluna não pode ser nula.
  }
}, {
  // Opções adicionais do modelo.
  // Define explicitamente o nome da tabela no banco de dados como 'usuarios'.
  tableName: 'usuarios',
  // Desativa a criação automática das colunas 'createdAt' e 'updatedAt'.
  timestamps: false,
});

// Exporta o modelo 'Usuario' para que ele possa ser utilizado em outras partes da aplicação (ex: nos controllers).
module.exports = Usuario;
