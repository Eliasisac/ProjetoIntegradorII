Guia de Configuração do Ambiente e Execução do Projeto HelpDeskSphere (Backend)-LINUX
Este guia detalha o processo de configuração do ambiente de desenvolvimento e execução do backend do projeto HelpDeskSphere. Ele aborda as ferramentas necessárias, a clonagem do repositório e a configuração do servidor Node.js com PostgreSQL, incluindo dicas para ambientes Linux e Windows.

1. Pré-requisitos: Instalação das Ferramentas Essenciais
Antes de clonar o projeto, sua máquina precisa ter algumas ferramentas instaladas.
1.1. Node.js e NPM (Node Package Manager)
    • Verificação: Abra o Terminal (Linux) ou CMD/PowerShell (Windows) e digite node -v e npm -v. Se retornar as versões, já está instalado.
    • Instalação (Recomendado NVM para Linux, Instalador para Windows):
        ◦ No Linux (Recomendado NVM - Node Version Manager):
            1. Instale curl (se não tiver): sudo apt install curl (Ubuntu/Debian) ou equivalente para sua distro.
            2. Instale NVM: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash (verifique a versão mais recente na página do NVM).
            3. Reinicie o Terminal ou execute source ~/.bashrc (ou ~/.zshrc).
            4. Instale a versão LTS do Node.js: nvm install --lts e nvm use --lts.
        ◦ No Windows:
            1. Baixe o instalador .msi (versão LTS - Long Term Support) do site oficial: https://nodejs.org/en/download/
            2. Execute o instalador e siga os passos (ele instala o NPM junto).
1.2. Git
    • Verificação: Abra o Terminal/CMD/PowerShell e digite git --version.
    • Instalação:
        ◦ No Linux: sudo apt install git (Ubuntu/Debian) ou equivalente.
        ◦ No Windows: Baixe o instalador do site oficial: https://git-scm.com/download/win e siga as instruções.
    • Configuração Inicial (após instalar):
      Bash
      git config --global user.name "Seu Nome Completo"
      git config --global user.email "seu.email@exemplo.com"
1.3. Visual Studio Code (VS Code)
    • Instalação: Baixe e instale do site oficial: https://code.visualstudio.com/
1.4. PostgreSQL (Servidor de Banco de Dados)
O PostgreSQL é essencial para o backend.
    • No Linux:
        1. Instalação:
           Bash
           sudo apt update
           sudo apt install postgresql postgresql-contrib
           (Para Ubuntu/Debian, use o gerenciador de pacotes da sua distro).
        2. Definir Senha para o Usuário postgres (Muito Importante!):
            ▪ Mude para o usuário postgres do sistema: sudo -i -u postgres
            ▪ Abra o shell psql: psql
            ▪ Dentro do psql (postgres=#), defina sua senha (substitua SUA_SENHA_FORTE):
              SQL
              ALTER USER postgres WITH PASSWORD 'SUA_SENHA_FORTE';
            ▪ Saia do psql: \q
            ▪ Volte para seu usuário normal: exit
        3. Configurar Autenticação (pg_hba.conf) - Se tiver erro "Peer authentication failed":
            ▪ Localize pg_hba.conf (geralmente /etc/postgresql/VERSAO/main/pg_hba.conf).
            ▪ Edite-o: sudo nano CAMINHO_DO_ARQUIVO_PG_HBA
            ▪ Altere peer para md5 nas linhas de local e 127.0.0.1/32 (deixe trust temporariamente para redefinir senha se esquecer, mas volte para md5 por segurança).
            ▪ Salve (Ctrl+O, Enter, Ctrl+X) e reinicie o serviço: sudo systemctl restart postgresql.
        4. Testar Conexão: psql -U postgres (pedirá a senha).
    • No Windows:
        1. Instalação:
            ▪ Baixe o instalador interativo do Windows: https://www.postgresql.org/download/windows/
            ▪ Execute o instalador. ATENÇÃO: Na etapa "Superuser password", defina e ANOTE uma senha forte para o usuário postgres. Esta é a senha que você usará no seu .env. Instale o pgAdmin também.
        2. Verificar Serviço: Pressione Win + R, digite services.msc, procure "postgresql" e verifique se está "Em Execução".
        3. Testar Conexão (CMD/PowerShell):
           Bash
           psql -U postgres
           Digite a senha que você definiu durante a instalação.
        4. Redefinir Senha (se esqueceu): Use o pgAdmin (ferramenta gráfica) para redefinir a senha do usuário postgres e depois reinicie o serviço PostgreSQL.

2. Clonando o Repositório do Projeto
    1. Abra seu Terminal (Linux) ou CMD/PowerShell (Windows).
    2. Escolha onde clonar o projeto. É uma boa prática ter uma pasta Projetos ou dev.
       Bash
       # Exemplo no Linux
       mkdir ~/Projetos
       cd ~/Projetos
       
       # Exemplo no Windows (você pode ir para Documents, ou criar uma pasta no C:)
       cd C:\Users\SeuUsuario\Documents
       mkdir Projetos
       cd Projetos
    3. Clone o repositório:
       Bash
       git clone https://github.com/Eliasisac/ProjetoIntegradorII.git
        ◦ Importante: Substitua SEU_USUARIO_GITHUB pelo nome de usuário GitHub do dono do repositório (Elias, no caso do projeto original).
    4. Entre na pasta do projeto clonado:
       Bash
       cd HelpDeskSphere

3. Configurando e Executando o Backend (Servidor Node.js)
Agora que você tem o código e as ferramentas, vamos configurar o backend.
    1. Navegue até a pasta do backend (server):
       Bash
       cd server
        ◦ Seu Terminal/CMD/PowerShell deve mostrar que você está na pasta HelpDeskSphere/server (Linux) ou HelpDeskSphere\server (Windows).
    2. Instale as Dependências do Node.js:
       Bash
       npm install
        ◦ Este comando lê o package.json e instala todas as bibliotecas que o servidor Node.js precisa (express, sequelize, pg, dotenv, etc.).
    3. Crie e Configure o Arquivo .env:
        ◦ Abra o projeto no VS Code (vá em File > Open Folder... e selecione a pasta raiz HelpDeskSphere).
        ◦ Na barra lateral do VS Code, clique com o botão direito na pasta server e selecione New File.
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
            ▪ JWT_SECRET: Mude para uma string de caracteres longa e aleatória (ex: fsadfsdfsdfa42342523523532532h35g235g325g325g235g325235g235g23g5).
            ▪ DB_PASSWORD: Substitua por EXATAMENTE a senha do usuário postgres que você definiu na instalação do PostgreSQL deste computador (Linux ou Windows). Se a senha estiver errada aqui, o servidor não conseguirá se conectar.
        ◦ Salve o arquivo .env (Ctrl + S).
    4. Crie o Banco de Dados helpdesksphere_db no PostgreSQL:
        ◦ Se você não criou este banco de dados ainda, ele precisa existir para o servidor se conectar.
        ◦ Abra seu Terminal/CMD/PowerShell e conecte-se ao psql (usando a senha correta):
          Bash
          psql -U postgres
        ◦ Dentro do prompt postgres=#, crie o banco de dados:
          SQL
          CREATE DATABASE helpdesksphere_db TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
        ◦ Saia do psql: \q
        ◦ Se você já criou o banco de dados, ele dará um erro de "already exists", o que é normal.
    5. Execute o Servidor Node.js:
        ◦ No Terminal/CMD/PowerShell (ainda na pasta HelpDeskSphere/server), digite:
          Bash
          node server.js
        ◦ Se tudo estiver correto, você deverá ver mensagens como:
          Banco de dados PostgreSQL conectado e sincronizado com Sequelize.
          Servidor rodando na porta 5000
    6. Teste no Navegador:
        ◦ Abra seu navegador (Chrome, Firefox, Edge, etc.).
        ◦ Na barra de endereço, digite:
          http://localhost:5000/
        ◦ Você deverá ver a mensagem: API do HelpDeskSphere está online e funcionando!

4. Solução de Problemas Comuns
    • Error: Cannot find module 'C:\Caminho\Para\server.js':
        ◦ Causa: Você não está na pasta correta (server) ao executar node server.js, ou o nome do arquivo está incorreto.
        ◦ Solução: Certifique-se de estar dentro da pasta server antes de executar node server.js (use cd server). Verifique se o arquivo está realmente nomeado server.js (não server.sj ou server.js.txt).
    • ConnectionError [SequelizeConnectionError]: password authentication failed for user "postgres":
        ◦ Causa: A senha no seu arquivo .env para DB_PASSWORD está incorreta ou não corresponde à senha do usuário postgres na sua instalação do PostgreSQL neste computador.
        ◦ Solução:
            1. Confirme a senha do seu usuário postgres no PostgreSQL (tentando conectar com psql -U postgres e a senha).
            2. Abra o arquivo .env na pasta server do seu projeto e atualize a linha DB_PASSWORD com a senha correta do postgres deste computador.
            3. Salve o .env e rode node server.js novamente.
    • FATAL: Peer authentication failed for user "postgres" (Somente Linux):
        ◦ Causa: O PostgreSQL no Linux está configurado para usar autenticação "peer" para conexões locais, o que significa que ele espera que o nome do usuário do sistema seja o mesmo do banco de dados (o que não é o caso ao conectar como postgres de seu usuário normal).
        ◦ Solução: Edite o arquivo pg_hba.conf (geralmente em /etc/postgresql/VERSAO/main/pg_hba.conf) e mude peer para md5 nas linhas de conexões locais (local all all e host all all 127.0.0.1/32). Salve e reinicie o serviço PostgreSQL (sudo systemctl restart postgresql).

Este guia deve cobrir todos os passos essenciais para sua equipe configurar e rodar o projeto. Boa sorte!