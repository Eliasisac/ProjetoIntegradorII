// server/models/associations.js
// Este arquivo define todas as associações entre os modelos
// Importa os modelos
const Usuario = require('./Usuario');

// Importa os modelos
const School = require('./School');
const Equipament = require('./Equipment');
const Ticket = require('./Ticket');

// Define as associações depois que todos os modelos foram carregados
Usuario.belongsTo(School, { foreignKey: 'schoolId' });//foreignKey é a chave estrangeira que referencia a escola à qual o usuário pertence
School.hasMany(Usuario, { foreignKey: 'schoolId' });//foreignKey é a chave estrangeira que referencia a escola à qual o usuário pertence

Ticket.belongsTo(Usuario, { as: 'creator', foreignKey: 'usuarioId' });//foreignKey é a chave estrangeira que referencia a escola à qual o usuário pertence
Ticket.belongsTo(Usuario, { as: 'technician', foreignKey: 'tecnicoId' });//foreignKey é a chave estrangeira que referencia a escola à qual o usuário pertence
Ticket.belongsTo(School, { foreignKey: 'schoolId' });// Um ticket pertence a uma escola(N/1)
Ticket.belongsTo(Equipament, { foreignKey: 'equipmentId' });// Um ticket pertence a um equipamento(N/1)

School.hasMany(Equipamento, { foreignKey: 'schoolId' });// Uma escola tem muitos equipamentos(1/N)
Equipament.belongsTo(School, { foreignKey: 'schoolId' });// Um equipamento pertence a uma escola(N/1)

Equipament.hasMany(Ticket, { foreignKey: 'equipmentId' });// Um equipamento pode estar associado a muitos tickets(1/N)
Ticket.belongsTo(Equipament, { foreignKey: 'equipmentId' });//  Um ticket está associado a um equipamento(N/1)

// Exporta todos os modelos para que possam ser acessados em outro lugar
module.exports = {
    Usuario,// Exporta o modelo Usuario para que possa ser acessado em outro lugar
    School,// Exporta o modelo School para que possa ser acessado em outro lugar
    Equipament,//   Exporta o modelo Equipament para que possa ser acessado em outro lugar
    Ticket,// Exporta o modelo Ticket para que possa ser acessado em outro lugar
};