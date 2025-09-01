const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');// para converter hash da senha

// recebe as informações do body
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  // procura no banco o user pelo email
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    // trataiva de erro
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // gera o token jwt
    const token = jwt.sign(
      { id: usuario.id, tipo_usuario: usuario.role },

      // se não tiver, usa por padrão "segredo123"
      process.env.JWT_SECRET || 'segredo123',

      // expira em 1h
      { expiresIn: '1h' }
    );
  
    // devolve pro front em JSON
    res.json({
      token,
      tipo_usuario: usuario.role
    });

    // trativa de erro
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
