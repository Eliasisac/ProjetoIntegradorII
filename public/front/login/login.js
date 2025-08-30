document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // previne o envio padrão

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

                // redireciona conforme o tipo de usuário
                switch (data.tipo_usuario) {
                    case 'admin':
                        window.location.href = '/admin';
                        break;
                    case 'tecnico':
                        window.location.href = '/tecnico';
                        break;
                    case 'convencional':
                        window.location.href = '/convencional';
                        break;
                }
            } else {
                alert(data.message || 'Erro no login');
            }
        } catch (err) {
            console.error('Erro na requisição:', err);
            alert('Erro no servidor');
        }
    });
});
