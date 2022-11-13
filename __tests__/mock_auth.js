const users = [
    {
        "primeiro_nome": "Fernando",
        "segundo_nome": "Teixeira",
        "email": "fteixeira113@gmail.com",
        "usuario": "fernandoteix113",
        "senha": "a8s51e4w63a$"
    },
    {
        "primeiro_nome": "Alice",
        "segundo_nome": "Fernandes",
        "email": "alicef@gmail.com",
        "usuario": "fernandoteix113",
        "senha": "teste2"
    },
    {
        "primeiro_nome": "Roberto",
        "segundo_nome": "Antunes",
        "email": "fteixeira113@gmail.com",
        "usuario": "robertoantunes222",
        "senha": "robertant"
    },
];

const logins = [
    {
        "usuario" : "fernandoteix113",
        "senha" : "a8s51e4w63a$"
    },
    {
        "usuario" : "8sf8dvas83",
        "senha" : "sadf8vd788d"
    },
    {
        "usuario" : "8sf8dvas83",
    },
    {
        "usuario" : "8sf8dvas83",
        "senha" : "sadf8vd788d",
        "id" : 1
    }
]

const incorrectUser = `{
    "primeiro_nome": "Fernando",
    "segundo_nome": "Teixeira",,
    "email": "fteixeira113@gmail.com",
    "usuario": "fernandoteix113",
    "senha": "teste1"
}`;

const incorrectLogin = `    {
    "usuario" ,: "8sf8dvas83",
    "senha" : "sadf8vd788d"
}`;

const incorrectRegisterObjects = [
    {
        "primeiro_nome" : "Pedro Antunes",
        "segundo_nome" : "Peixoto",
        "email" : "pedropeixoto687@gmail.com",
        "usuario" : "pedropeixt21",
        "senha" : "teste999",
        "id" : 9099
    },
    {
        "primeiro_nome" : "Pedro Antunes",
        "email" : "pedropeixoto687@gmail.com",
        "usuario" : "pedropeixt21",
        "senha" : "teste999"
    }
];

module.exports = {users, logins, incorrectUser, incorrectLogin, incorrectRegisterObjects};