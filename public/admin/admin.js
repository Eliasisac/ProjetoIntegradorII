document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');

    function mostrarSecao(id) {
        sections.forEach(sec => sec.style.display = 'none'); // esconde as seções
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'block' // mostra somente a seção selecionada
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault(); // impede reload automatico do browser

            navLinks.forEach(l => l.style.fontWeight = 'normal'); // remove o visual de "active" dos itens

            this.style.fontWeight = 'bold';
            const id = this.getAttribute('href').substring(1);
            mostrarSecao(id); // mostra o botão clicado
        });
    });

    // esconde tudo ao inicair a tela
    sections.forEach(sec => sec.style.display = 'none');
});