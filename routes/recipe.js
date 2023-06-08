const express = require("express");
const z = require("zod"); //utilizando para validar usuário
const { saveRecipe, findRecipesByUser, deleteRecipeById, updateRecipe, findRecipesById } = require("../database/recipe");
const auth = require("../middleware/auth");

const router = express.Router();

const RecipeSchema = z.object({
    name: z.string(),
    description: z.string(),
    cooking_time: z.number(),
})

const IdRecipeSchema = z.number();

const UpdatedRecipeSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    cooking_time: z.number().optional(),
})

router.get("/recipe", auth, async (req, res) => {
    const recipes = await findRecipesByUser(req.userId);
    res.json({
        recipes,
    });
});


router.post("/recipe", auth, async (req, res) => {
    try {
        const recipe = RecipeSchema.parse(req.body); //validando os dados inseridos pelo usuário
        const userId = req.userId;
        const savedRecipe = await saveRecipe(recipe, userId);
        res.status(201).json({
            recipe: savedRecipe,
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


router.delete("/recipe/:id", auth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        IdRecipeSchema.parse(id); //evita que parâmetro não seja número pro delete
        const userId = req.userId;
        const del = await deleteRecipeById(id, userId);

        if (del.count === 0) {
            return res.status(404).json({
                message: "No recipe found for this user",
            });
        }

        res.status(204).send();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: "Server Error",
        });
    };
})


router.put("/recipe/:id", auth, async (req, res) => {

    try {
        const id = Number(req.params.id);
        IdRecipeSchema.parse(id); //evita que parâmetro não seja número pro update

        const userId = req.userId;
        const recipe = UpdatedRecipeSchema.parse(req.body); //validando os dados inseridos pelo usuário
        const updatedRecipe = await updateRecipe(id, recipe, userId);

        if (updatedRecipe.count === 0) {
            return res.status(404).json({
                message: "Recipe not found for this user",
            });
        }

        const recipeFinal = await findRecipesById(id);

        res.json({
            recipe: recipeFinal
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: "Server Error",
        });
    }

})


module.exports = router;