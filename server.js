const express = require("express"); //importando o express

const server = express(); //instanciando o express na variável server

server.use(express.json()); //informando o json como formato utilizado no body

module.exports = server; //exportando o server para o restante do projeto