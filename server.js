const express = require("express"); //importando o express
const userRouter = require("./routes/user"); //importando a rota do user
const recipeRouter = require("./routes/recipe"); //importando a rota da recipe

const server = express(); //instanciando o express na variável server

server.use(express.json()); //informando o json como formato utilizado no body
server.use(userRouter); //informando pro sistema usar a rota do user
server.use(recipeRouter); //informando pro sistema usar a rota da recipe

module.exports = server; //exportando o server para o restante do projeto