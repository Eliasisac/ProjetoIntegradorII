        // ==== DOMContentLoaded: garante que os elementos foram carregados antes de usar ==== 
        document.addEventListener('DOMContentLoaded', function () {

            // Seleciona elementos importantes do DOM
            const registerButton = document.getElementById('register');
            const emailContainer = document.getElementById('email-container');
            const loginForm = document.getElementById('login-form');
            const forgotPasswordLink = document.getElementById('forgot-password-link');

            if (!loginForm || !forgotPasswordLink) {
                console.error('Erro: elementos do formulário não encontrados.');
                return;
            }

            // Ao clicar no botão "Solicitar" (do painel azul) exibimos e-mail de contato
            if (registerButton) {
                registerButton.addEventListener('click', function () {
                    const contatoEmail = 'teste@gmail.com'; // substituir pelo e-mail real
                    alert(`Para mais informações, entre em contato conosco pelo e-mail: ${contatoEmail}`);
                });
            }

            // "Esqueceu sua senha" -> mostra contato
            forgotPasswordLink.addEventListener('click', function (e) {
                e.preventDefault();
                const contatoEmail = 'teste@gmail.com';
                alert(`Se você esqueceu sua senha, entre em contato conosco pelo e-mail: ${contatoEmail}`);
            });

            // Defina a URL base da API aqui
            const API_BASE_URL = 'https://rota'; // preencher com a rota real

            console.log('API Base URL definida como:', API_BASE_URL);

            // Função auxiliar para obter o valor do role selecionado (cliente|tecnico)
            function getSelectedRole() {
                const radios = document.getElementsByName('role');
                for (let r of radios) {
                    if (r.checked) return r.value;
                }
                // default fallback
                return 'cliente';
            }

            // Evento de submit do formulário de login
            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                // pega valores do formulário
                const email = loginForm.querySelector('input[type="email"]').value.trim();
                const senha = loginForm.querySelector('input[type="password"]').value;
                const role = getSelectedRole(); // novo campo que indica Cliente/Técnico

                // Validação simples
                if (!email || !senha) {
                    alert('Preencha email e senha.');
                    return;
                }

                try {
                    // Incluímos role no body da requisição para que o backend saiba o tipo de login
                    const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, senha, role }),
                    });

                    const data = await response.json();

                    if (response.ok && data.token) {
                        console.log('Login bem-sucedido!');
                        // guarda o token
                        localStorage.setItem('token', data.token);
                        // opcional: guardar o role também
                        localStorage.setItem('role', role);

                        // Redirecionamento: você pode desejar rotas diferentes para técnico/cliente
                        // Exemplo: se precisar redirecionar técnicos para um painel diferente, altere aqui
                        // if (role === 'tecnico') window.location.href = '/painel-tecnico';

                        // por enquanto mantive a mesma rota do seu projeto
                        window.location.href = '/front/selecMaq/selecMaq.html';
                    } else {
                        alert(`${data.message || 'Erro ao fazer Login.'} (Código ${response.status})`);
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                    alert('Erro ao fazer login. Tente novamente.');
                }
            });

        });