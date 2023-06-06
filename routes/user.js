const express = require("express");
const z = require("zod"); //utilizando para validar usuário
const bcrypt = require("bcrypt"); //utilizado para criptografar senhas
const { findUserByEmail, saveUser } = require("../database/user");

const router = express.Router();

const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6)
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
            res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({  //tratando demais erros
            message: "Server Error",
        });
    };
});


module.exports = router;