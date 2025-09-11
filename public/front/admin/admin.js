document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');

    function mostrarSecao(id) {
        sections.forEach(sec => sec.style.display = 'none');
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'block';

        if (id === 'logs') {
            categoriasLogs.forEach(div => div.style.display = 'none');
            const autenticacao = document.getElementById('logs-autenticacao');
            autenticacao.style.display = 'block';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault();
            navLinks.forEach(l => l.style.fontWeight = 'normal');
            this.style.fontWeight = 'bold';
            const id = this.getAttribute('href').substring(1);
            mostrarSecao(id);
        });
    });

    sections.forEach(sec => sec.style.display = 'none');

    // ========= LOGS =========
    const filtroBtns = document.querySelectorAll('#filtros button');
    const categoriasLogs = document.querySelectorAll('.log-categoria');
    categoriasLogs.forEach(div => div.style.display = 'none');
    document.getElementById('logs-autenticacao').style.display = 'block';
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-categoria');
            categoriasLogs.forEach(div => {
                div.style.display = (div.id === 'logs-' + cat) ? 'block' : 'none';
            });
        });
    });

    // ========= USUÁRIOS =========
    const tabelaUsuarios = document.querySelector('#listaUsuarios tbody');

    async function carregarUsuarios() {
        try {
            const resp = await fetch('/users', {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            if (!resp.ok) throw new Error('Erro ao buscar usuários');
            const usuarios = await resp.json();
            tabelaUsuarios.innerHTML = '';
            usuarios.forEach(u => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${u.id}</td>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>
                        <button class="editar" data-id="${u.id}">Editar</button>
                        <button class="deletar" data-id="${u.id}">Excluir</button>
                    </td>
                `;
                tabelaUsuarios.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar usuários');
        }
    }

    document.querySelector('a[href="#usuarios"]').addEventListener('click', carregarUsuarios);

    // ======== CRIAR USUÁRIO =========
    const btnCriar = document.getElementById('criarUsuario');
    btnCriar.addEventListener('click', async () => {
        const nome = prompt('Nome:');
        const email = prompt('Email:');
        const senha = prompt('Senha:');
        // Pergunta e normaliza o tipo de usuário
        let rolePrompt = prompt('Tipo de usuário (admin/tecnico/usuario):');
        rolePrompt = rolePrompt.toLowerCase();
        const roleMap = { usuario: 'client', tecnico: 'technician', admin: 'admin' };
        const role = roleMap[rolePrompt];
        if (!role) return alert('Tipo de usuário inválido');

        if (!nome || !email || !senha) return alert('Todos os campos são obrigatórios!');


        let schoolId;

        // Se for client, buscar lista de escolas
        if (role === 'client') {
            try {
                const escolaResp = await fetch('/schools', {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                if (!escolaResp.ok) throw new Error('Erro ao buscar escolas');
                const escolas = await escolaResp.json();
        
                // cria mapa numerado
                let mensagem = 'Escolha a escola:\n';
                const mapa = {};
                escolas.forEach((e, i) => {
                    const num = i + 1;
                    mensagem += `${num}: ${e.nome}\n`;
                    mapa[num] = e.id;
                });
        
                const escolha = prompt(mensagem);
                schoolId = mapa[escolha]; // converte número para UUID
                if (!schoolId) return alert('Escolha inválida');
        
            } catch (err) {
                console.error(err);
                return alert('Erro ao carregar escolas');
            }
        }
        

        try {
            const resp = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ nome, email, senha, role, schoolId })
            });
            if (!resp.ok) {
                const erro = await resp.json();
                throw new Error(erro.error || 'Erro ao criar usuário');
            }
            alert('Usuário criado com sucesso!');
            carregarUsuarios();
        } catch (err) {
            console.error(err);
            alert('Falha ao criar usuário: ' + err.message);
        }
    });

    // ======== CRIAR ESCOLA =========
    const btnCriarEscola = document.createElement('button');
    btnCriarEscola.textContent = 'Criar Escola';
    document.querySelector('#usuarios').prepend(btnCriarEscola);

    btnCriarEscola.addEventListener('click', async () => {
        const nome = prompt('Nome da Escola:')?.trim();
        const endereco = prompt('Endereço da Escola:')?.trim();
        const telefone = prompt('Telefone da Escola:')?.trim();
        const email = prompt('Email da Escola:')?.trim();
        
        if (!nome || !endereco || !telefone || !email) {
            return alert('Todos os campos são obrigatórios');
        }
        
        try{
        const resp = await fetch('/schools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ nome, endereco, telefone, email })
        });
            if (!resp.ok) throw new Error('Erro ao criar escola');
            alert('Escola criada com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Falha ao criar escola');
        }
    });

    // ======== EDITAR/DELETAR USUÁRIO =========
    tabelaUsuarios.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.classList.contains('editar')) {
            const nome = prompt('Novo nome:');
            const email = prompt('Novo email:');
            const role = prompt('Novo tipo (admin/tecnico/usuario):');
            try {
                const resp = await fetch(`/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ nome, email, role })
                });
                if (!resp.ok) throw new Error('Erro ao editar usuário');
                alert('Usuário atualizado!');
                carregarUsuarios();
            } catch (err) {
                console.error(err);
                alert('Falha ao editar usuário');
            }
        }

        if (e.target.classList.contains('deletar')) {
            if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
            try {
                const resp = await fetch(`/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (!resp.ok) throw new Error('Erro ao excluir usuário');
                alert('Usuário removido!');
                carregarUsuarios();
            } catch (err) {
                console.error(err);
                alert('Falha ao excluir usuário');
            }
        }
    });

});

// ======== LOGOUT =========
const btnLogout = document.getElementById('logoutBtn');
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token'); // apaga o token JWT
    window.location.href = '/';  // redireciona pra tela de login
});
