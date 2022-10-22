const app = require('../index');
const {users, incorrectUser} = require('./mock_auth');
const request = require('supertest');
const Pool = require('pg').Pool
const pool = new Pool ( {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASSWORD,
    database: process.env.DATABASE
});

describe('Rota de Cadastro de Usuários', () => {
    test ('Inserção de Usuário: Sintaxe JSON Incorreta', async () => {
        const response = await request(app).post('/api/user/register').send(incorrectUser);
        expect(response.statusCode).toEqual(400);
    });
    test ('Inserção de Usuário: Sintaxe JSON OK', async () => {
        const response = await request(app).post('/api/user/register').send(users[0]);
        expect(response.body).toEqual({"success": "Cadastro realizado com sucesso!"});
    });
    test ('Reinserção de Usuário: Mesmo Usuário', async () => {
        const response = await request(app).post('/api/user/register').send(users[1]);
        expect(response.body).toEqual({"error": `Usuário ${users[1].usuario} já cadastrado.`});
    });
    test ('Reinserção de Usuário: Mesmo E-mail', async () => {
        const response = await request(app).post('/api/user/register').send(users[2]);
        expect(response.body).toEqual({"error": `E-mail ${users[2].email} já cadastrado.`});
    });

    let query = `DELETE FROM usuarios WHERE primeiro_nome = '${users[0].primeiro_nome}' AND segundo_nome = '${users[0].segundo_nome}' AND email = '${users[0].email}';`;
    pool.query(query, (error, dbResponse) => {
        if(error) throw new Error(`Erro ao executar a query: ${query}`);
    });
});