document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');

    function mostrarSecao(id) {
        // esconde todas as seções
        sections.forEach(sec => sec.style.display = 'none');

        // mostra a seção selecionada
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'block';

        // se a seção for logs, garante que a categoria de autenticação esteja visível
        if (id === 'logs') {
            categoriasLogs.forEach(div => div.style.display = 'none'); // esconde todas
            const autenticacao = document.getElementById('logs-autenticacao');
            autenticacao.style.display = 'block';
        }
    }

    // evento para cada link do navbar
    navLinks.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault(); // evita reload
            // remove destaque de todos os links
            navLinks.forEach(l => l.style.fontWeight = 'normal');
            // destaca o link clicado
            this.style.fontWeight = 'bold';
            const id = this.getAttribute('href').substring(1);
            mostrarSecao(id);
        });
    });

    // esconde todas as seções ao iniciar a pagina
    sections.forEach(sec => sec.style.display = 'none');

    /*
        LOGS
    */

    const filtroBtns = document.querySelectorAll('#filtros button');
    const categoriasLogs = document.querySelectorAll('.log-categoria');

    // Esconde todas as categorias inicialmente
    categoriasLogs.forEach(div => div.style.display = 'none');

    // Mostra por padrão apenas erros de autenticação
    const autenticacao = document.getElementById('logs-autenticacao');
    autenticacao.style.display = 'block';

    // Filtro de categorias
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-categoria');
            categoriasLogs.forEach(div => {
                if (div.id === 'logs-' + cat) {
                    div.style.display = 'block';
                } else {
                    div.style.display = 'none';
                }
            });
        });
    });

});
