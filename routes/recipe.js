const express = require("express");
const z = require("zod"); //utilizando para validar usuário
const { saveRecipe, findRecipesByUser, deleteRecipeById, updateRecipe, findRecipesById } = require("../database/recipe");
const auth = require("../middleware/auth");

const router = express.Router();

const RecipeSchema = z.object({
    name: z.string({
        required_error: "name must be required",
        invalid_type_error: "name must be string"
    }),
    description: z.string({
        required_error: "description must be required",
        invalid_type_error: "description must be string"
    }),
    cooking_time: z.number({
        required_error: "cooking_time must be required",
        invalid_type_error: "cooking_time must be number",
    }).min(0),
})

const IdRecipeSchema = z.number();

const UpdatedRecipeSchema = z.object({
    name: z.string({
        invalid_type_error: "name must be string"
    }).optional(),
    description: z.string({
        invalid_type_error: "description must be string"
    }).optional(),
    cooking_time: z.number({
        invalid_type_error: "cooking_time must be number"
    }).min(0).optional(),
})

router.get("/recipe", auth, async (req, res) => {
    const recipes = await findRecipesByUser(req.userId);
    res.json({
        recipes,
    });
});


router.post("/recipe", auth, async (req, res, next) => {
    try {
        const recipe = RecipeSchema.parse(req.body); //validando os dados inseridos pelo usuário
        const userId = req.userId;
        const savedRecipe = await saveRecipe(recipe, userId);
        res.status(201).json({
            recipe: savedRecipe,
        });
    } catch (error) {
        next(error);
    };
});


router.delete("/recipe/:id", auth, async (req, res, next) => {
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
        next(error);
    };
})


router.put("/recipe/:id", auth, async (req, res, next) => {

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
        next(error);
    }

})


module.exports = router;