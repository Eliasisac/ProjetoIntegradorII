const Usuario = require('../models/usuario');
const redirect = require('../routes/redirect'); // módulo que decide a página com base no tipo_usuario
// const bcrypt = require('bcrypt');        pra quando tiver usando hash no lugar da senha comum

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuario pelo email
    const usuario = await Usuario.findOne({
      where: { email }
    });
    // trativa de erro
    if (!usuario) {
      return res.status(401).send('Credenciais inválidas');
    }

    // MUDAR PRA HASH
    if (usuario.senha !== password) {
      return res.status(401).send('Credenciais inválidas');
    }

    // Recupera o tipo de usuário
    const tipoUsuario = usuario.tipo_usuario;

    // Redireciona para a pagina correta via modulo redirect
    redirect.handleRedirection(req, res, tipoUsuario);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
};
