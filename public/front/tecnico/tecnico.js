document.addEventListener("DOMContentLoaded", () => {
    const listaChamados = document.getElementById("listaChamados");
    const meusChamados = document.getElementById("meusChamados");
    const btnCriar = document.getElementById("btnCriarChamado");
    const inputChamado = document.getElementById("chamado");

    const token = localStorage.getItem('token');

    // ----------------- Carregar chamados abertos -----------------
    async function carregarChamados() {
        try {
            const res = await fetch("http://127.0.0.1:3000/tickets/abertos", {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!res.ok) throw new Error('Erro ao carregar chamados abertos');

            const chamados = await res.json();
            listaChamados.innerHTML = "";

            chamados.forEach(c => {
                const li = document.createElement("li");
                li.textContent = `${c.id} - ${c.descricao} - Status: ${c.status}`;

                const btnAceitar = document.createElement("button");
                btnAceitar.textContent = "Aceitar";
                btnAceitar.addEventListener("click", () => aceitarChamado(c.id));

                li.appendChild(btnAceitar);
                listaChamados.appendChild(li);
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    // ----------------- Carregar chamados do técnico -----------------
    async function carregarMeusChamados() {
        try {
            const res = await fetch("http://127.0.0.1:3000/tickets/me", {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!res.ok) throw new Error('Erro ao carregar meus chamados');

            const chamados = await res.json();
            meusChamados.innerHTML = "";

            chamados.forEach(c => {
                const li = document.createElement("li");
                li.textContent = `${c.id} - ${c.descricao} - Status: ${c.status}`;

                // Botão para alterar status
                const selectStatus = document.createElement("select");
                ['aberto','em andamento','resolvido','fechado'].forEach(status => {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status;
                    if (c.status === status) option.selected = true;
                    selectStatus.appendChild(option);
                });

                selectStatus.addEventListener("change", () => atualizarStatus(c.id, selectStatus.value));

                li.appendChild(selectStatus);
                meusChamados.appendChild(li);
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    // ----------------- Aceitar chamado -----------------
    async function aceitarChamado(id) {
        try {
            const res = await fetch(`http://127.0.0.1:3000/tickets/${id}/atribuir`, {
                method: "PUT",
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (!res.ok) throw new Error('Erro ao aceitar chamado');

            alert('Chamado aceito com sucesso!');
            carregarChamados();
            carregarMeusChamados();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    // ----------------- Atualizar status do chamado -----------------
    async function atualizarStatus(id, status) {
        try {
            const res = await fetch(`http://127.0.0.1:3000/tickets/${id}/status`, {
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error('Erro ao atualizar status');

            alert('Status atualizado com sucesso!');
            carregarMeusChamados();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    // ----------------- Inicial -----------------
    carregarChamados();
    carregarMeusChamados();
});
