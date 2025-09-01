document.addEventListener("DOMContentLoaded", () => {
    const listaChamados = document.getElementById("listaChamados");

    // Carregar chamados abertos
    async function carregarChamados() {
        try {
            const res = await fetch("http://127.0.0.1:3000/tickets/abertos", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!res.ok) throw new Error('Erro ao carregar chamados');

            const chamados = await res.json();

            listaChamados.innerHTML = "";
            chamados.forEach(c => {
                const li = document.createElement("li");
                li.textContent = `${c.id} - ${c.descricao}`;
                
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

    // Aceitar chamado
    async function aceitarChamado(id) {
        try {
            const res = await fetch(`http://127.0.0.1:3000/tickets/${id}/atribuir`, {
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!res.ok) throw new Error('Erro ao aceitar chamado');

            alert('Chamado aceito com sucesso!');
            carregarChamados();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    carregarChamados();
});
