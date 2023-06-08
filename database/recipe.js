const prisma = require("./prisma");

const findRecipesByUser = (userId) => {
    return prisma.recipe.findMany({
        where: {
            userId,
        },
    });
};
const findRecipesById = (id) => {
    return prisma.recipe.findUnique({
        where: {
            id,
        },
    });
};

const saveRecipe = (recipe, userId) => {
    return prisma.recipe.create({
        data: {
            name: recipe.name,
            description: recipe.description,
            cooking_time: recipe.cooking_time,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
};


const deleteRecipeById = (id, userId) => {
    return prisma.recipe.deleteMany({
        where: {
            id: id,
            userId: userId
        },
    });
};

const updateRecipe = (id, recipe, userId) => {
    return prisma.recipe.updateMany({
        where: {
            id: id,
            userId: userId,
        },
        data: recipe,
    });
};


module.exports = {
    findRecipesByUser,
    saveRecipe,
    deleteRecipeById,
    updateRecipe,
    findRecipesById
};