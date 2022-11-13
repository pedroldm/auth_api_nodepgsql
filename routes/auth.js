const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pool = require('pg').Pool;
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

const registerRequest = {"primeiro_nome" : "", "segundo_nome" : "", "email" : "", "usuario" : "", "senha" : ""}
const loginRequest = {"usuario" : "", "senha" : ""}

router.post('/register', async (request, response) => {
    try {
        if(!compareKeys(request.body, registerRequest)) throw new ValidationError(`Formato incorreto`);

        let mesmoEmail = await pool.query(`SELECT count(*) FROM usuarios WHERE email = '${request.body.email}';`);
        if (parseInt(mesmoEmail.rows[0].count) > 0) throw new ValidationError(`E-mail ${request.body.email} já cadastrado`);

        let mesmoUsuario = await pool.query(`SELECT count(*) FROM usuarios WHERE usuario = '${request.body.usuario}';`);
        if (parseInt(mesmoUsuario.rows[0].count) > 0) throw new ValidationError(`Usuário ${request.body.usuario} já cadastrado`);

        const salt = await bcrypt.genSalt(10);
        request.body.senha = await bcrypt.hash(request.body.senha, salt);

        pool.query(`INSERT INTO usuarios (primeiro_nome, segundo_nome, email, usuario, senha) VALUES ('${request.body.primeiro_nome}', '${request.body.segundo_nome}', '${request.body.email}', '${request.body.usuario}', '${request.body.senha}');`, (error, dbResponse) => {
            if (!error) {
                response.status(200).json({"status" : "success", "message" : "Cadastro realizado com sucesso"});
            }
            else {
                response.status(400).send();
            }
        });
    } catch (err) {
        if (err instanceof ValidationError)
            response.status(400).json({"status" : "failure", "message" : err.message});
        else
            response.status(400).send();
    }
});

router.post('/login', async (request, response) => {
    try {
        if(!compareKeys(request.body, loginRequest)) throw new ValidationError(`Formato incorreto`);

        let user = await pool.query(`SELECT * FROM usuarios WHERE usuario = '${request.body.usuario}';`);
        if (!user.rows.length) throw new ValidationError(`Usuário ${request.body.usuario} não cadastrado`);

        if (await bcrypt.compare(request.body.senha, user.rows[0].senha)) {
            const token = jwt.sign({_id: user.rows[0].usuario}, process.env.TOKENSCT);
            response.header('auth-token', token).send({"status" : "success", "auth-token": token});
        }
        else {
            response.status(200).json({"status" : "failure", "message" : "Senha incorreta"});
        }
    } catch (err) {
        if (err instanceof ValidationError)
            response.status(400).json({"status" : "failure", "message" : err.message});
        else
            response.status(400).send();
    }
});

function compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

module.exports = router;