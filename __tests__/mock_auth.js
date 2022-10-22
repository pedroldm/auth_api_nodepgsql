const incorrectUser = `{
    "primeiro_nome": "Fernando",
    "segundo_nome": "Teixeira",,
    "email": "fteixeira113@gmail.com",
    "usuario": "fernandoteix113",
    "senha": "teste1"
}`;
const users = [
    {
        "primeiro_nome": "Fernando",
        "segundo_nome": "Teixeira",
        "email": "fteixeira113@gmail.com",
        "usuario": "fernandoteix113",
        "senha": "teste1"
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

module.exports = {users, incorrectUser};