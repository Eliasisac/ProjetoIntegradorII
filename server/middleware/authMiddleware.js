

const jwt = require('jsonwebtoken');
/* const jwt é a biblioteca usada para criar e verificar tokens JWT (JSON Web Tokens)
   req é o objeto de requisição que contém informações sobre a requisição HTTP
   res é o objeto de resposta que é usado para enviar a resposta HTTP
   next é uma função que é chamada para passar o controle para o próximo middleware*/

//moudulo exporta uma função middleware
module.exports = function(req, res, next) {
    // autenticação é feita através do cabeçalho Authorization
    // O token é enviado no formato
     // 1. Confirma que o middleware foi iniciado
    console.log('Middleware de Autenticação iniciado.');
    const authHeader = req.headers['authorization'];
    //const token extrai o token do cabeçalho de autorização
    // Se o cabeçalho de autorização existir, divide a string em um array usando o espaço como separador
    // e pega o segundo elemento do array (o token)
    // Se o cabeçalho de autorização não existir, token será undefined
    

    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    // authHeader.split(' ')[1] pega o token
    //authHeader && verifica se authHeader não é nulo ou indefinido
    //bearer TOKEN é o formato esperado do token no cabeçalho de autorização

    if (!token){
        console.log('Erro: Nenhum token fornecido.');
        return res.sendStatus(401);
    }
    // 2. Mostra o token que está sendo verificado
    console.log('Token recebido:', token);
    // Verifica o token usando a chave secreta definida na variável de ambiente JWT_SECRET
   

    jwt.verify(token,'segredo123',(err,user) => {
        if (err){

            return res.sendStatus(403);
              // 3. Mostra o erro se a verificação falhar
            console.log('Erro na verificação do token:', err.message);
        } 
       
        // Se o token for inválido ou expirado, retorna 403 (Forbidden)
        // Se o token for válido, adiciona as informações do usuário na requisição e chama next() para passar o controle para o próximo middleware
        req.user = user; // adiciona info do usuario na requisição
        // Chama o próximo middleware
        // 4. Mostra o payload do token se a verificação for bem-sucedida
        console.log('Token decodificado com sucesso. Dados do usuário:', req.user);
        //next() passa o controle para o próximo middleware
         console.log(req.user);
        // Verificação de role (opcional)
        // Define os roles permitidos para acessar a rota

        const allowedRoles = ['client', 'technician', 'admin'];// Define os roles permitidos para acessar a rota
        // Verifica se o role do usuário está na lista de roles permitidos
        if (!allowedRoles.includes(req.user.role)) {// Verifica se o role do usuário está na lista de roles permitidos
            return res.sendStatus(403); // Role não permitida
        }
        console.log('Usuário autenticado com sucesso. Próximo middleware...');
        // Se o token for válido e o role for permitido, a requisição continua
        next();
    });
};
