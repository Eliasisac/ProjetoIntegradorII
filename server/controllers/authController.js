const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// recebe as informações do body
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  // procura no banco o user pelo email
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    // trataiva de erro
    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // gera o token jwt
    const token = jwt.sign(
      { id: usuario.id, tipo_usuario: usuario.tipo_usuario },

      // se não tiver, usa por padrão "segredo123"
      process.env.JWT_SECRET || 'segredo123',

      // expira em 1h
      { expiresIn: '1h' }
    );
  
    // devolve pro front em JSON
    res.json({
      token,
      tipo_usuario: usuario.tipo_usuario
    });

    // trativa de erro
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
