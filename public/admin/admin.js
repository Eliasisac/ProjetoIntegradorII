document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main > section');

    function mostrarSecao(id) {
        sections.forEach(sec => sec.style.display = 'none');
    }
})