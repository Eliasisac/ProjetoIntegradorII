Guia de Configuração do Ambiente e Execução do Projeto HelpDeskSphere no Windows
Este guia detalha o processo de configuração do ambiente de desenvolvimento e execução do backend do projeto HelpDeskSphere, focado exclusivamente no sistema operacional Windows. Ele aborda as ferramentas necessárias, a clonagem do repositório e a configuração do servidor Node.js com PostgreSQL.

1. Pré-requisitos: Instalação das Ferramentas Essenciais no Windows
Antes de clonar o projeto, sua máquina Windows precisa ter algumas ferramentas instaladas.
1.1. Node.js e NPM (Node Package Manager)
    • Verificação: Abra o Prompt de Comando (CMD) ou PowerShell (pesquisando por "cmd" ou "powershell" no Menu Iniciar) e digite node -v e npm -v. Se retornar os números das versões, o Node.js já está instalado.
    • Instalação (se não estiver instalado):
        1. Baixe o instalador .msi (escolha a versão LTS - Long Term Support, que é a mais estável) do site oficial: https://nodejs.org/en/download/
        2. Execute o instalador baixado e siga as instruções. Ele instalará o Node.js e o NPM (Node Package Manager) automaticamente.
        3. Após a instalação, feche e reabra seu CMD/PowerShell para que as mudanças tenham efeito e verifique a instalação novamente.
1.2. Git
    • Verificação: Abra o CMD/PowerShell e digite git --version.
    • Instalação (se não estiver instalado):
        1. Baixe o instalador para Windows do site oficial: https://git-scm.com/download/win
        2. Execute o instalador e siga os passos, mantendo as opções padrão na maioria dos casos.
    • Configuração Inicial (após instalar):
        1. No CMD/PowerShell, configure seu nome de usuário e e-mail que você usa no GitHub:
           Bash
           git config --global user.name "Seu Nome Completo"
           git config --global user.email "seu.email@exemplo.com"
1.3. Visual Studio Code (VS Code)
    • Instalação: Baixe e instale do site oficial: https://code.visualstudio.com/
        ◦ Execute o instalador e siga os passos.
1.4. PostgreSQL (Servidor de Banco de Dados)
O PostgreSQL é essencial para o backend.
    1. Instalação:
        ◦ Vá para a página de downloads do PostgreSQL para Windows: https://www.postgresql.org/download/windows/
        ◦ Baixe o instalador interativo ("Download the installer").
        ◦ Execute o arquivo .exe baixado e siga as instruções do instalador.
        ◦ MUITO IMPORTANTE DURANTE A INSTALAÇÃO:
            ▪ Quando ele pedir para criar uma senha para o usuário padrão postgres (Superuser password), defina uma senha forte e ANOTE-A em um lugar seguro! Esta é a senha que você usará no seu arquivo .env para o projeto.
            ▪ Certifique-se de que os componentes pgAdmin (ferramenta gráfica) e Command Line Tools (inclui o psql) estejam selecionados para instalação.
    2. Verificar o Serviço PostgreSQL:
        ◦ Pressione as teclas Windows + R, digite services.msc e pressione Enter.
        ◦ Na janela de Serviços, procure por "postgresql" na lista.
        ◦ Verifique se o "Status" está como "Em Execução" (Running) e se o "Tipo de Inicialização" é "Automático". Se não estiver rodando, clique com o botão direito e selecione "Iniciar".
    3. Testar a Conexão ao PostgreSQL (com psql no CMD/PowerShell):
        ◦ Abra o Prompt de Comando (CMD) ou PowerShell.
        ◦ Geralmente, o instalador do PostgreSQL adiciona o psql ao PATH do sistema. Tente o comando diretamente:
          Bash
          psql -U postgres
        ◦ Ele pedirá a "Password for user postgres:". Digite a senha que você definiu durante a instalação do PostgreSQL no passo 1.4.1.
        ◦ Se você conseguir entrar no prompt postgres=# (e não vir erros), significa que a senha está correta e a conexão funciona! Digite \q e pressione Enter para sair.
        ◦ Se a senha falhar (Erro password authentication failed): Você precisará redefinir a senha do usuário postgres. A forma mais fácil no Windows é usando o pgAdmin:
            ▪ Abra o pgAdmin (procure no Menu Iniciar).
            ▪ Conecte-se ao seu servidor (provavelmente "PostgreSQL 1X" em "Servers"). Ele pedirá a senha. Tente a que você digitou durante a instalação.
            ▪ No pgAdmin, na árvore à esquerda, expanda "Login/Group Roles", clique com o botão direito em "postgres" e selecione "Properties".
            ▪ Vá na aba "Definition" e você poderá definir uma nova senha para o usuário postgres.
            ▪ Após alterar a senha no pgAdmin, reinicie o serviço PostgreSQL (passo 1.4.2) para que a mudança tenha efeito.

2. Clonando o Repositório do Projeto no Windows
    1. Abra seu Prompt de Comando (CMD) ou PowerShell.
    2. Escolha onde clonar o projeto. É uma boa prática ter uma pasta dedicada para seus projetos. Por exemplo:
       DOS
       cd C:\Users\SeuUsuario\Documents  <-- Você pode usar Documents ou Downloads
       mkdir Projetos
       cd Projetos
       (Substitua SeuUsuario pelo seu nome de usuário no Windows).
    3. Clone o repositório:
       Bash
       git clone https://github.com/Eliasisac/ProjetoIntegradorII.git
        ◦ Importante: Substitua SEU_USUARIO_GITHUB pelo nome de usuário GitHub do proprietário do repositório (no caso, Elias).
    4. Entre na pasta do projeto clonado:
       DOS
       cd HelpDeskSphere

3. Configurando e Executando o Backend (Servidor Node.js)
Agora que você tem o código e as ferramentas, vamos configurar o backend.
    1. Navegue até a pasta do backend (server):
        ◦ Ainda no seu CMD/PowerShell, digite:
          DOS
          cd server
        ◦ Seu prompt agora deve mostrar que você está na pasta HelpDeskSphere\server.
    2. Instale as Dependências do Node.js:
        ◦ Com o Terminal/CMD/PowerShell dentro da pasta server, digite:
          Bash
          npm install
        ◦ Este comando lerá o arquivo package.json e instalará todas as bibliotecas (dependencies) que o servidor Node.js precisa (Express, Sequelize, pg, dotenv, etc.).
    3. Crie e Configure o Arquivo .env:
        ◦ Abra o projeto no VS Code (vá em File > Open Folder... e selecione a pasta raiz HelpDeskSphere).
        ◦ Na barra lateral do VS Code (Explorer), clique com o botão direito na pasta server e selecione New File.
        ◦ Nomeie o novo arquivo como .env (certifique-se de que é .env e não .env.txt ou outro nome).
        ◦ Cole o seguinte conteúdo no arquivo .env:
          PORT=5000
          JWT_SECRET=UM_SEGREDO_MUITO_FORTE_E_ALEATORIO_PARA_JWT
          
          DB_DIALECT=postgres
          DB_HOST=localhost
          DB_PORT=5432
          DB_USER=postgres
          DB_PASSWORD=SUA_SENHA_DO_POSTGRES_DO_SEU_COMPUTADOR
          DB_NAME=helpdesksphere_db
        ◦ MUITO IMPORTANTE:
            ▪ JWT_SECRET: Mude para uma string de caracteres longa e aleatória (ex: exemploDeSegredoAleatorio34k5j6h7g8f9d0s1a2).
            ▪ DB_PASSWORD: Substitua por EXATAMENTE a senha do usuário postgres que você definiu na instalação do PostgreSQL deste computador Windows. Se a senha estiver incorreta aqui, o servidor não conseguirá se conectar ao banco de dados.
        ◦ Salve o arquivo .env (Ctrl + S).
    4. Crie o Banco de Dados helpdesksphere_db no PostgreSQL (se ainda não existir neste dispositivo):
        ◦ O banco de dados em si não é clonado com o código; ele precisa ser criado em cada máquina.
        ◦ Abra seu CMD/PowerShell (se já estiver aberto e na pasta server, pode manter) e conecte-se ao psql (usando a senha correta do seu postgres):
          Bash
          psql -U postgres
        ◦ Dentro do prompt postgres=#, digite o comando para criar o banco de dados:
          SQL
          CREATE DATABASE helpdesksphere_db TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
        ◦ Se o banco de dados helpdesksphere_db já existir, ele dará um erro de "already exists", o que é normal. Nesse caso, você pode ignorar.
        ◦ Saia do psql: \q
    5. Execute o Servidor Node.js:
        ◦ No Terminal/CMD/PowerShell (ainda na pasta HelpDeskSphere\server), digite:
          Bash
          node server.js
        ◦ Se tudo estiver configurado corretamente, você deverá ver mensagens no seu terminal como:
          Banco de dados PostgreSQL conectado e sincronizado com Sequelize.
          Servidor rodando na porta 5000
    6. Teste no Navegador:
        ◦ Abra seu navegador web (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).
        ◦ Na barra de endereço, digite o seguinte e pressione Enter:
          http://localhost:5000/
        ◦ Você deverá ver a mensagem: API do HelpDeskSphere está online e funcionando! Isso confirma que seu backend está ativo e respondendo.

4. Solução de Problemas Comuns no Windows
    • Error: Cannot find module 'C:\Caminho\Para\server.js':
        ◦ Causa: Você está tentando executar node server.js mas não está na pasta correta (HelpDeskSphere\server). O Node.js não consegue encontrar o arquivo no caminho especificado.
        ◦ Solução: Certifique-se de que seu Terminal/CMD/PowerShell esteja exatamente na pasta HelpDeskSphere\server antes de executar o comando. Use cd C:\Caminho\Para\HelpDeskSphere\server para navegar até lá.
    • ConnectionError [SequelizeConnectionError]: password authentication failed for user "postgres":
        ◦ Causa: A senha que você inseriu na linha DB_PASSWORD do seu arquivo .env está incorreta ou não corresponde à senha do usuário postgres na sua instalação do PostgreSQL neste computador Windows.
        ◦ Solução:
            1. Primeiro, certifique-se de que você consegue se conectar ao PostgreSQL usando psql -U postgres no CMD/PowerShell com a senha que você acha que é a correta. Se não conseguir, redefina a senha do postgres usando o pgAdmin (como descrito no passo 1.4.3).
            2. Depois de confirmar a senha, abra o arquivo .env na pasta server do seu projeto no VS Code e atualize a linha DB_PASSWORD com a senha CORRETA do postgres deste computador. Salve o .env e rode node server.js novamente.
    • Serviço PostgreSQL não está rodando:
        ◦ Causa: O servidor de banco de dados PostgreSQL não está ativo em segundo plano.
        ◦ Solução: Pressione Win + R, digite services.msc, procure por "postgresql" e inicie o serviço se ele não estiver "Em Execução".
