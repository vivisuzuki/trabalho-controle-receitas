const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization; //buscando o authorizathion do header 

        if (!authorization) return res.status(401).send(); //tratando casos onde não há authorization

        const token = authorization.split(" ")[1]; //Buscando o token pela segunda posição do header
        const payload = jwt.verify(token, process.env.SECRET) //validando o token 

        req.userId = payload.userId; //passar o userId para frente pra saber quem está logado
        next();
    } catch (error) {
        res.status(401).send();
    }
}

module.exports = auth; //exportando o middleware de autenticação