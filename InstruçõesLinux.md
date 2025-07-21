# HelpDeskSphere (Backend) - Guia de Configuração e Execução (Linux e Windows)

Este guia cobre a configuração do ambiente de desenvolvimento e execução do backend do projeto **HelpDeskSphere**, com suporte a **Linux e Windows**, incluindo instalação de ferramentas, clonagem do repositório, configuração do Node.js e PostgreSQL e resolução de erros comuns.

---

## 1. Pré-requisitos

### 1.1. Node.js e NPM

- **Verificação:**
  ```bash
  node -v
  npm -v
  ```
#### Linux (via NVM recomendado)

```bash
sudo apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # ou ~/.zshrc
nvm install --lts
nvm use --lts
```

#### Windows

Baixe o instalador LTS em: [https://nodejs.org/en/download](https://nodejs.org/en/download)
O instalador inclui o NPM automaticamente.

---

### 1.2. Git

* **Verificação:**

  ```bash
  git --version
  ```

#### Linux

```bash
sudo apt install git
```

#### Windows

Baixe o instalador: [https://git-scm.com/download/win](https://git-scm.com/download/win)

* **Configuração inicial:**

  ```bash
  git config --global user.name "Seu Nome"
  git config --global user.email "seu.email@exemplo.com"
  ```

---

### 1.3. Visual Studio Code

Disponível para ambos os sistemas:
👉 [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

### 1.4. PostgreSQL

#### Linux

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

* **Definir senha do usuário `postgres`:**

  ```bash
  sudo -i -u postgres
  psql
  ALTER USER postgres WITH PASSWORD 'SUA_SENHA_FORTE';
  \q
  exit
  ```

* **(Opcional) Editar pg\_hba.conf se necessário:**

    ```bash
    sudo nano /etc/postgresql/<versão>/main/pg_hba.conf
    ```

Altere `peer` para `md5` e reinicie:

```bash
sudo systemctl restart postgresql
```

#### Windows

1. Baixe o instalador em: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Durante a instalação, defina uma **senha forte** para o usuário `postgres`.
3. Instale também o **pgAdmin** se desejar.
4. Verifique se o serviço está em execução:

   * Pressione `Win + R`, digite `services.msc`, encontre `postgresql` e verifique se está "Em Execução".
5. Testar no terminal (CMD ou PowerShell):

```bash
psql -U postgres
```

---

## 2. Clonando o Projeto

### Linux

```bash
mkdir ~/Projetos
cd ~/Projetos
git clone https://github.com/Eliasisac/ProjetoIntegradorII.git
cd ProjetoIntegradorII/HelpDeskSphere
```

### Windows (CMD ou PowerShell)

```powershell
cd C:\Users\SeuUsuario\Documents
mkdir Projetos
cd Projetos
git clone https://github.com/Eliasisac/ProjetoIntegradorII.git
cd ProjetoIntegradorII\HelpDeskSphere
```

---

## 3. Executando o Backend

### 3.1. Navegue até a pasta do backend:

```bash
cd server
```

### 3.2. Instale as dependências:

```bash
npm install
```

### 3.3. Crie o arquivo `.env` em `server/` com o conteúdo:

```env
PORT=5000
JWT_SECRET=UM_SEGREDO_MUITO_FORTE_E_ALEATORIO_PARA_JWT

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES_DO_SEU_COMPUTADOR
DB_NAME=helpdesksphere_db
```

> ⚠️ Substitua `JWT_SECRET` por uma string aleatória e `DB_PASSWORD` pela senha correta da sua instalação PostgreSQL local.

### 3.4. Criar o banco de dados:

```bash
psql -U postgres
CREATE DATABASE helpdesksphere_db TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
\q
```

### 3.5. Execute o servidor:

```bash
node server.js
```

Você verá mensagens como:

```
Banco de dados PostgreSQL conectado e sincronizado com Sequelize.
Servidor rodando na porta 5000
```

### 3.6. Teste no navegador:

Acesse: [http://localhost:5000](http://localhost:5000)

---

## 4. Solução de Problemas Comuns

### Erro: `Cannot find module '.../server.js'`

* **Causa:** Você não está na pasta correta.
* **Solução:** Navegue até `server/` antes de rodar o comando.

---

### Erro: `SequelizeConnectionError: password authentication failed for user "postgres"`

* **Causa:** Senha incorreta no `.env`.
* **Solução:**

  * Teste com `psql -U postgres`
  * Corrija `DB_PASSWORD` no `.env`

---

### Erro: `Peer authentication failed for user "postgres"` (somente Linux)

* **Causa:** PostgreSQL está usando autenticação `peer`.
* **Solução:** Edite `pg_hba.conf`, troque `peer` por `md5`, e reinicie:

```bash
sudo systemctl restart postgresql
```

---

## ✅ Conclusão

Após seguir esses passos, o ambiente de backend estará configurado e funcional tanto no **Linux** quanto no **Windows**.

---
