// Carrega as variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

// Importa a classe Sequelize do pacote sequelize
const { Sequelize } = require('sequelize');

// Cria uma nova instância do Sequelize para estabelecer a conexão com o banco de dados.
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Nome do banco de dados
    process.env.DB_USER,      // Usuário do banco de dados
    process.env.DB_PASSWORD,  // Senha do banco de dados
    {
        // Configurações adicionais da conexão
        host: process.env.DB_HOST,        // O host onde o banco de dados está rodando
        port: process.env.DB_PORT,        // A porta do banco de dados
        dialect: process.env.DB_DIALECT,  // O dialeto do banco de dados (ex: 'mysql', 'postgres', 'sqlite')
        
        // Desativa a exibição dos logs SQL gerados pelo Sequelize no console.
        // Útil para não poluir o console em ambiente de produção ou durante testes.
        logging: false, 
    }
);

// Exporta a instância configurada do Sequelize para que possa ser utilizada em outras partes da aplicação (ex: para definir modelos e executar queries).
module.exports = sequelize;