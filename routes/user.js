const express = require("express");
const z = require("zod"); //utilizando para validar usuário
const bcrypt = require("bcrypt"); //utilizado para criptografar senhas
const jwt = require("jsonwebtoken");
const { findUserByEmail, saveUser } = require("../database/user");
const { route } = require("../server");

const router = express.Router();

const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6)
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

router.post("/register", async (req, res) => {
    try {
        const user = UserSchema.parse(req.body);
        const isEmailAlreadyBeingUsed = await findUserByEmail(user.email);
        if (isEmailAlreadyBeingUsed) return res.status(400).json({ //verificando se email já está sendo usado
            message: "Email is already being used",
        })

        const hashedPassword = bcrypt.hashSync(user.password, 10); //criptografando senha
        user.password = hashedPassword; //substituindo senha por senha criptografada

        const savedUser = await saveUser(user); //salvando user no banco
        delete savedUser.password; //excluindo senha antes de devolver na request

        res.json({ user: savedUser });
    } catch (error) {
        if (error instanceof z.ZodError) { //tratando erros de validações inseridas pra cadastro de usuários
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({  //tratando demais erros
            message: "Server Error",
        });
    };
});


router.post("/login", async (req, res) => {
    try {
        const data = LoginSchema.parse(req.body);
        const user = await findUserByEmail(data.email);

        if (!user) return res.status(401).send(); //validando se usuário existe no banco

        const isSamePassword = bcrypt.compareSync(data.password, user.password);
        if (!isSamePassword) return res.status(401).send(); //validando se a senha inserida é a mesma do banco

        const token = jwt.sign(
            {
                userId: user.id  //o que vai ter na chave privada
            },
            process.env.SECRET  //senha que valida a chave
        );

        res.json({
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) { //tratando erros de validações inseridas pra cadastro de usuários
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({  //tratando demais erros
            message: "Server Error",
        });
    };
});


module.exports = router;