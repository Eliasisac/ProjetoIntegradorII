document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = loginForm.querySelector('input[name="email"]').value.trim();
        const senha = loginForm.querySelector('input[name="senha"]').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('tipo_usuario', data.tipo_usuario);

                // chama função para carregar página protegida
                loadProtectedPage(data.tipo_usuario, data.token);
            } else {
                alert(data.message || 'Erro no login');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            alert('Erro no servidor');
        }
    });
});

async function loadProtectedPage(tipo_usuario, token) {
    let rota = '';
    switch (tipo_usuario) {
        case 'admin': rota = '/admin'; break;
        case 'tecnico': rota = '/tecnico'; break;
        case 'convencional': rota = '/convencional'; break;
    }

    const response = await fetch(rota, {
        headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
    } else {
        alert('Não autorizado');
    }
}
