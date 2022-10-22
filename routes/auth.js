const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Pool = require('pg').Pool
const pool = new Pool ( {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASSWORD,
    database: process.env.DATABASE
});

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

router.post('/register', async (request, response) => {
    try {
        let sameEmail = await pool.query(`SELECT count(*) FROM usuarios WHERE email = '${request.body.email}';`);
        if (parseInt(sameEmail.rows[0].count) > 0) throw new ValidationError(`E-mail ${request.body.email} já cadastrado.`);

        let sameUsuario = await pool.query(`SELECT count(*) FROM usuarios WHERE usuario = '${request.body.usuario}';`);
        if (parseInt(sameUsuario.rows[0].count) > 0) throw new ValidationError(`Usuário ${request.body.usuario} já cadastrado.`);

        const salt = await bcrypt.genSalt(10);
        request.body.senha = await bcrypt.hash(request.body.senha, salt);

        pool.query(`INSERT INTO usuarios (primeiro_nome, segundo_nome, email, usuario, senha) VALUES ('${request.body.primeiro_nome}', '${request.body.segundo_nome}', '${request.body.email}', '${request.body.usuario}', '${request.body.senha}');`, (error, dbResponse) => {
            if (!error) {
                response.status(200).json({"success": "Cadastro realizado com sucesso!"});
            }
            else {
                response.status(400).send();
            }
        });
    } catch (err) {
        if (err instanceof ValidationError)
            response.status(400).json({"error" : err.message});
        else
            response.status(400).send();
    }
});

router.post('/login', async (request, response) => {
    try {
        let user = await pool.query(`SELECT * FROM usuarios WHERE usuario = '${request.body.usuario}';`);
        if (!user.rows.length) throw new ValidationError(`Usuário ${request.body.usuario} não cadastrado!`);

        (await bcrypt.compare(request.body.senha, user.rows[0].senha)) ? response.status(200).json({"status": "Log in realizado com sucesso!"}) : response.status(200).json({"Erro": "Senha incorreta."});
    } catch (err) {
        if (err instanceof ValidationError)
            response.status(400).json({"error" : err.message});
        else
            response.status(400).send();
    }
});

module.exports = router;