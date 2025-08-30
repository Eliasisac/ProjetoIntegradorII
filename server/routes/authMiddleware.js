const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'segredo123', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // adiciona info do usuario na requisição
        next();
    });
};
