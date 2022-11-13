const app = require('../index');
const {users, logins, incorrectUser, incorrectLogin, incorrectRegisterObjects} = require('./mock_auth');
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
    pool.query(`DELETE FROM usuarios WHERE email = '${users[0].email}';`, (error, dbResponse) => {
        if(error) throw new Error(`Erro ao executar a query: ${query}`);
    });
    pool.query(`DELETE FROM usuarios WHERE usuario = '${users[0].usuario}';`, (error, dbResponse) => {
        if(error) throw new Error(`Erro ao executar a query: ${query}`);
    });

    test ('Inserção de Usuário: Objeto C/ Índice Adicional', async () => {
        const response = await request(app).post('/api/user/register').send(incorrectRegisterObjects[0]);
        expect(response.statusCode).toEqual(400);
    });
    test ('Inserção de Usuário: Objeto S/ Índice', async () => {
        const response = await request(app).post('/api/user/register').send(incorrectRegisterObjects[1]);
        expect(response.statusCode).toEqual(400);
    });
    test ('Inserção de Usuário: Sintaxe JSON Incorreta', async () => {
        const response = await request(app).post('/api/user/register').send(incorrectUser);
        expect(response.statusCode).toEqual(400);
    });
    test ('Inserção de Usuário: Cadastro Correto', async () => {
        const response = await request(app).post('/api/user/register').send(users[0]);
        expect(response.body).toEqual({"status" : "success", "message" : "Cadastro realizado com sucesso"});
    });
    test ('Inserção de Usuário: Mesmo Usuário', async () => {
        const response = await request(app).post('/api/user/register').send(users[1]);
        expect(response.body).toEqual({"status" : "failure", "message" : `Usuário ${users[1].usuario} já cadastrado`});
    });
    test ('Inserção de Usuário: Mesmo E-mail', async () => {
        const response = await request(app).post('/api/user/register').send(users[2]);
        expect(response.body).toEqual({"status" : "failure", "message" : `E-mail ${users[2].email} já cadastrado`});
    });
});

describe('Rota de Log-in', () => {
    pool.query(`DELETE FROM usuarios WHERE email = '${users[0].email}';`, (error, dbResponse) => {
        if(error) throw new Error(`Erro ao executar a query: ${query}`);
    });

    test ('Log-in: Objeto C/ Índice Adicional', async () => {
        const response = await request(app).post('/api/user/register').send(logins[3]);
        expect(response.statusCode).toEqual(400);
    });
    test ('Log-in: Objeto S/ Índice', async () => {
        const response = await request(app).post('/api/user/register').send(logins[2]);
        expect(response.statusCode).toEqual(400);
    });
    test ('Log-in: Sintaxe JSON Incorreta', async () => {
        const response = await request(app).post('/api/user/register').send(incorrectLogin);
        expect(response.statusCode).toEqual(400);
    });
    test ('Log-in: Senha Correta', async () => {
        let response = await request(app).post('/api/user/register').send(users[0]);
        response = await request(app).post('/api/user/login').send(logins[0]);
        expect(response.body).toEqual(expect.objectContaining({status : "success"}));
    });
    test ('Log-in: Senha Incorreta', async () => {
        response = await request(app).post('/api/user/login').send({"usuario" : logins[0].usuario, "senha" : "a7s5f1d8%"});
        expect(response.body).toEqual({"status" : "failure", "message" : "Senha incorreta"});
    });
    test ('Log-in: Usuário Não Cadastrado', async () => {
        response = await request(app).post('/api/user/login').send(logins[1]);
        expect(response.body).toEqual({"status" : "failure", "message" : `Usuário ${logins[1].usuario} não cadastrado`});
    });
});

describe('Rota de Acesso Privado', () => {
    test ('Acesso s/ JWT', async() => {
        const response = await request(app).get('/api/private');
        expect(response.body).toEqual({"status" : "failure", "message" : "Acesso negado"});
    });
/*     test ('Acesso c/ JWT', async() => {
        let response = await request(app).post('/api/user/login').send({"usuario" : logins[0].usuario, "senha" : logins[0].senha});
        console.log(response);
    }); */
});