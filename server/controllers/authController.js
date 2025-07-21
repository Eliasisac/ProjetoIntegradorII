const Usuario = require('../models/usuario');

exports.login = async (req, res) => {
  const { email, password, tipo_usuario } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        email,
        senha: password,
        tipo_usuario,
      },
    });

    if (usuario) {
      res.send(`Login bem-sucedido como ${tipo_usuario}!`);
    } else {
      res.status(401).send('Credenciais inválidas ou tipo de usuário incorreto');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
};
