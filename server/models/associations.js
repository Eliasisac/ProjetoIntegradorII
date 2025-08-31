// server/models/associations.js
// Este arquivo centraliza a definição de todas as associações (relacionamentos) entre os modelos do Sequelize.
// Importar e executar este arquivo em um ponto central da aplicação (como o server.js) garante que todos os relacionamentos sejam estabelecidos.

// Importa os modelos que serão associados.
const Usuario = require('./Usuario');
const School = require('./School');
const Equipment = require('./Equipment');
const Ticket = require('./Ticket');

// --- Relacionamento: School <-> Usuario (Um-para-Muitos) ---
// Uma escola pode ter vários usuários, mas um usuário pertence a apenas uma escola.

// Define que um Usuário pertence a uma Escola. Adiciona a chave estrangeira 'schoolId' em Usuario.
Usuario.belongsTo(School, { foreignKey: 'schoolId' });
// Define que uma Escola pode ter muitos Usuários. Permite usar métodos como `school.getUsuarios()`.
School.hasMany(Usuario, { foreignKey: 'schoolId' });

// --- Relacionamento: School <-> Equipment (Um-para-Muitos) ---
// Uma escola pode ter vários equipamentos, mas um equipamento pertence a apenas uma escola.

// Define que uma Escola pode ter muitos Equipamentos.
School.hasMany(Equipment, { foreignKey: 'schoolId' });
// Define que um Equipamento pertence a uma Escola. Adiciona a chave estrangeira 'schoolId' em Equipment.
Equipment.belongsTo(School, { foreignKey: 'schoolId' });

// --- Relacionamento: Equipment <-> Ticket (Um-para-Muitos) ---
// Um equipamento pode ter vários tickets associados a ele, mas um ticket se refere a um único equipamento.

// Define que um Equipamento pode ter muitos Tickets.
Equipment.hasMany(Ticket, { foreignKey: 'equipmentId' });
// Define que um Ticket pertence a um Equipamento. Adiciona a chave estrangeira 'equipmentId' em Ticket.
Ticket.belongsTo(Equipment, { foreignKey: 'equipmentId' });

// --- Relacionamentos do Ticket com outros modelos ---

// Um Ticket pertence a um Usuário (que o criou).
// O alias 'creator' é usado para diferenciar do técnico. Permite usar `ticket.getCreator()`.
Ticket.belongsTo(Usuario, { as: 'creator', foreignKey: 'usuarioId' });

// Um Ticket pertence a um Usuário (que é o técnico responsável).
// O alias 'technician' permite usar `ticket.getTechnician()`.
Ticket.belongsTo(Usuario, { as: 'technician', foreignKey: 'tecnicoId' });

// Um Ticket pertence a uma Escola.
Ticket.belongsTo(School, { foreignKey: 'schoolId' });

// Exporta todos os modelos para que possam ser acessados em outros lugares da aplicação,
// já com as associações configuradas.
module.exports = {
    Usuario,
    School,
    Equipment,
    Ticket,
};