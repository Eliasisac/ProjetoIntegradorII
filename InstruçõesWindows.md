# HelpDeskSphere (Backend) - Guia de Configuração e Execução (Windows)

Este guia orienta a instalação e configuração do ambiente de desenvolvimento do backend do projeto **HelpDeskSphere**, com foco no sistema **Windows**. Inclui instalação de ferramentas, clonagem do repositório, criação do banco PostgreSQL e execução do servidor Node.js.

---

## 1. Pré-requisitos

### 1.1. Node.js e NPM

- **Verifique a instalação**:
  ```cmd
  node -v
  npm -v
  ```

* **Se não estiver instalado**:

  1. Acesse: [https://nodejs.org/en/download](https://nodejs.org/en/download)
  2. Baixe o instalador `.msi` da versão **LTS**.
  3. Execute e finalize a instalação.
  4. Reinicie o terminal (CMD ou PowerShell) e verifique novamente com `node -v`.

---

### 1.2. Git

* **Verifique a instalação**:

  ```cmd
  git --version
  ```

* **Se não estiver instalado**:

  1. Baixe o instalador: [https://git-scm.com/download/win](https://git-scm.com/download/win)
  2. Siga as opções padrão da instalação.

* **Configuração inicial**:

  ```cmd
  git config --global user.name "Seu Nome Completo"
  git config --global user.email "seu.email@exemplo.com"
  ```

---

### 1.3. Visual Studio Code

* Baixe e instale: [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

### 1.4. PostgreSQL

* **Instalação**:

  1. Acesse: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
  2. Baixe o instalador interativo.
  3. Durante a instalação:

     * Defina uma **senha forte** para o usuário `postgres`.
     * Certifique-se de instalar também o **pgAdmin** e as **Command Line Tools**.

* **Verificar serviço**:

  1. Pressione `Win + R` → digite `services.msc`.
  2. Procure por `postgresql` → verifique se está "Em Execução".
  3. Caso não esteja, clique com o botão direito e selecione "Iniciar".

* **Testar conexão com `psql`**:

  ```cmd
  psql -U postgres
  ```

* **Se falhar (senha incorreta)**:

  * Use o **pgAdmin** para redefinir a senha:

    * Acesse `Login/Group Roles > postgres > Properties > Definition`.

---

## 2. Clonando o Projeto

1. Abra o **CMD** ou **PowerShell**.

2. Crie uma pasta para os projetos:

   ```cmd
   cd C:\Users\SeuUsuario\Documents
   mkdir Projetos
   cd Projetos
   ```

3. Clone o repositório:

   ```cmd
   git clone https://github.com/Eliasisac/ProjetoIntegradorII.git
   cd ProjetoIntegradorII\HelpDeskSphere
   ```

---

## 3. Executando o Backend

### 3.1. Acesse a pasta do backend

```cmd
cd server
```

### 3.2. Instale as dependências

```cmd
npm install
```

### 3.3. Crie o arquivo `.env` com o conteúdo:

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

> ⚠️ **Substitua** `JWT_SECRET` por uma string aleatória e `DB_PASSWORD` pela senha correta do seu PostgreSQL.

### 3.4. Criar o banco de dados PostgreSQL

```cmd
psql -U postgres
```

```sql
CREATE DATABASE helpdesksphere_db TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C';
\q
```

### 3.5. Execute o servidor Node.js

```cmd
node server.js
```

Se estiver tudo certo, verá:

```
Banco de dados PostgreSQL conectado e sincronizado com Sequelize.
Servidor rodando na porta 5000
```

### 3.6. Teste no navegador

Abra: [http://localhost:5000](http://localhost:5000)

---

## 4. Solução de Problemas Comuns (Windows)

### ❌ Erro: `Cannot find module 'C:\Caminho\Para\server.js'`

* **Causa:** Você não está na pasta correta (`server`).
* **Solução:** Execute `cd server` antes de `node server.js`.

---

### ❌ Erro: `SequelizeConnectionError: password authentication failed for user "postgres"`

* **Causa:** Senha incorreta em `DB_PASSWORD`.
* **Solução:**

  1. Verifique se consegue conectar com `psql -U postgres`.
  2. Corrija a senha no `.env`.
  3. Salve e execute novamente.

---

### ❌ Serviço PostgreSQL não está rodando

* **Causa:** PostgreSQL não está em execução.
* **Solução:**

  * Execute `services.msc`, localize `postgresql` e clique em **Iniciar**.

---

## ✅ Conclusão

Após seguir todos os passos, o backend do HelpDeskSphere estará pronto para uso em ambiente Windows.

---
