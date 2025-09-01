document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function (e) {
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
                // Salva token e tipo de usuário corretamente
                localStorage.setItem('token', data.token);
                localStorage.setItem('tipo_usuario', data.tipo_usuario);
                console.log(data);
                // Redireciona para a página protegida
                loadProtectedPage(data.tipo_usuario);
            }
             else {
                alert(data.message || 'Credenciais inválidas');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            alert('Erro no servidor');
        }
    });
});

async function loadProtectedPage(tipo_usuario) {
    let rota = '';
    switch (tipo_usuario) {
        case 'admin': rota = '/admin'; break;
        case 'technician': rota = '/tecnico'; break;
        case 'client': rota = '/convencional'; break;
        default:
            alert('Tipo de usuário inválido');
            return;
    }

    try {
        const response = await fetch(rota, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) throw new Error('Não autorizado');

        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}
