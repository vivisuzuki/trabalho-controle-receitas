const express = require("express"); //importando o express
const userRouter = require("./routes/user"); //importando a rota do user

const server = express(); //instanciando o express na variável server

server.use(express.json()); //informando o json como formato utilizado no body
server.use(userRouter); //informando pro sistema usar a rota do user

module.exports = server; //exportando o server para o restante do projeto