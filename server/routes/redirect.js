// função pra redirecionar o usuario pra a pagina correta
exports.handleRedirection = (req, res, tipoUsuario) => {
    switch (tipoUsuario) {
        case 'admin':
            return res.redirect('/admin/index.html');      // admin -> public/admin/index.html
        case 'tecnico':
            return res.redirect('/tecnico/index.html');    // técnico -> public/tecnico/index.html
        case 'convencional':
            return res.redirect('/convencional/index.html'); // usuario convencional -> public/convencional/index.html
        default:
            // caso o tipo de usuario não seja reconhecido
            return res.status(403).send('Tipo de usuário inválido');
    }
};
