const jwt = require('jsonwebtoken');

function authJWT (request, response, next) {
    const token = request.header('auth-token');
    if (!token) return response.status(401).json({"status" : "failure", "message" : "Acesso negado"});

    try {
        const verified = jwt.verify(token, process.env.TOKENSCT);
        request.user = verified;
        next();
    } catch (err) {
        response.status(400).send('Token inválido');
    }
}

module.exports = authJWT;