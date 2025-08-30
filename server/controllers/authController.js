const Usuario = require('../models/usuario'); // consulta de usuario
const path = require('path');

exports.login = async (req, res) => {
  const { email, password } = req.body; // recebe as informações

  // verifica se a autenticação passa
  try {
    const usuario = await Usuario.findOne({ where: { email } });

    //tratativa de erros
    if (!usuario || usuario.senha !== password) {
      return res.status(401).send('Credenciais inválidas');
    }

    // decide a pagina conforme o tipo de usuario
    let destino;
    switch (usuario.tipo_usuario) {
      case 'admin':
        destino = path.join(__dirname, '..', 'public', 'admin', 'index.html');
        break;
      case 'tecnico':
        destino = path.join(__dirname, '..', 'public', 'tecnico', 'index.html');
        break;
      default:
        destino = path.join(__dirname, '..', 'public', 'convencional', 'index.html');
    }

    return res.sendFile(destino);

  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
};
