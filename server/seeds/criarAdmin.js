require('dotenv').config();
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario.js');
const School = require('../models/School.js');

async function criarAdminSeNaoExistir() {
  try {
    // 1️⃣ Verifica se já existe a escola "NIT RPT"
    let escola = await School.findOne({ where: { nome: 'NIT RPT' } });
    if (!escola) {
      escola = await School.create({
        nome: 'NIT RPT',
        endereco: 'Endereço',
        telefone: '0000-0000',
        email: 'nitrpt@empresa.com',
        cnpj: '00.000.000/0001-00'
      });
      console.log('Escola NIT RPT criada!');
    } else {
      console.log('Escola NIT RPT já existe.');
    }

    // 2️⃣ Verifica se já existe algum admin
    const anyAdmin = await Usuario.findOne({ where: { role: 'admin' } });
    if (anyAdmin) {
      console.log('Já existe pelo menos um usuário admin.');
      return;
    }

    // 3️⃣ Cria o admin vinculado à escola
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await Usuario.create({
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: hashedPassword,
      role: 'admin',
      schoolId: escola.id
    });

    console.log('Usuário admin criado com sucesso!');
  } catch (err) {
    console.error('Erro ao criar admin e escola:', err);
    process.exit(1);
  }
}

module.exports = criarAdminSeNaoExistir;
