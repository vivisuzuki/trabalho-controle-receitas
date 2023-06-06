const express = require("express");
const z = require("zod"); //utilizando para validar usuário

const router = express.Router();

const UserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6)
});

router.post("/register", (req, res) => {
    try {
        const user = UserSchema.parse(req.body);
        res.send({ user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: "Server Error",
        });
    };
});


module.exports = router;