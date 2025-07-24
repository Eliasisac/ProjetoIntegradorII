// Importa o modelo 'Usuario' para interagir com a tabela de usuários no banco de dados.
const Usuario = require('../models/usuario');

// Exporta a função 'login' para que ela possa ser usada como um manipulador de rota (route handler).
// A função é 'async' porque ela executa operações de banco de dados que são assíncronas.
exports.login = async (req, res) => {
  // Extrai os campos 'email', 'password' e 'tipo_usuario' do corpo (body) da requisição HTTP.
  const { email, password, tipo_usuario } = req.body;

  // O bloco 'try...catch' é usado para lidar com possíveis erros durante a execução do código.
  try {
    // Procura por um único usuário no banco de dados que corresponda a todos os critérios fornecidos.
    // IMPORTANTE: Comparar senhas em texto plano (como feito aqui) é uma falha de segurança grave.
    // Em um ambiente de produção, a senha enviada pelo usuário deve ser comparada com uma senha "hasheada" no banco de dados.
    const usuario = await Usuario.findOne({
      // A cláusula 'where' especifica as condições para a busca.
      where: {
        email: email,           // Procura um usuário com o email fornecido.
        senha: password,        // Procura um usuário com a senha fornecida (inseguro!).
        tipo_usuario: tipo_usuario, // Verifica se o tipo de usuário também corresponde.
      },
    });

    // Se um usuário com as credenciais correspondentes for encontrado...
    if (usuario) {
      // ...envia uma resposta de sucesso para o cliente.
      res.send(`Login bem-sucedido como ${tipo_usuario}!`);
    } else {
      // ...caso contrário, envia uma resposta de "Não Autorizado" (status 401) com uma mensagem de erro.
      res.status(401).send('Credenciais inválidas ou tipo de usuário incorreto');
    }
  } catch (err) {
    // Se ocorrer qualquer outro erro durante o processo (ex: falha na conexão com o banco de dados)...
    // ...registra o erro no console do servidor para depuração.
    console.error(err);
    // ...e envia uma resposta de "Erro Interno do Servidor" (status 500).
    res.status(500).send('Erro no servidor');
  }
};
