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

router.post('/register', async (request, response) => {
    try {
        let sameEmail = await pool.query(`SELECT count(*) FROM usuarios WHERE email = '${request.body.email}';`);
        if (sameEmail.rows[0].count) throw new Error(`E-mail ${request.body.email} já cadastrado.`);

        let sameUsuario = await pool.query(`SELECT count(*) FROM usuarios WHERE usuario = '${request.body.usuario}';`);
        if (sameUsuario.rows[0].count) throw new Error(`Usuário ${request.body.email} já cadastrado.`);

        const salt = await bcrypt.genSalt(10);
        request.body.senha = await bcrypt.hash(request.body.senha, salt);

        pool.query(`INSERT INTO usuarios (primeiro_nome, segundo_nome, email, usuario, senha) VALUES ('${request.body.primeiro_nome}', '${request.body.segundo_nome}', '${request.body.email}', '${request.body.usuario}', '${request.body.senha}');`, (error, dbResponse) => {
            if (!error) {
                response.status(200).json({"success": "Cadastro realizado com sucesso!"});
            }
            else {
                response.status(400);
            }
        });
    } catch (err) {
        response.status(400).json({"error" : err.message});
    }
});

router.post('/login', async (request, response) => {
    try {
        let user = await pool.query(`SELECT * FROM usuarios WHERE usuario = '${request.body.usuario}';`);
        if (!user.rows.length) throw new Error(`Usuário ${request.body.usuario} não cadastrado!`);

        (await bcrypt.compare(request.body.senha, user.rows[0].senha)) ? response.status(200).json({"status": "Log in realizado com sucesso!"}) : response.status(200).json({"Erro": "Senha incorreta."});
    } catch (err) {
        response.status(400).json({"error" : err.message});
    }
});

module.exports = router;