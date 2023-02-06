const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishController {
  async create(request, response) {
    const { name, description, price, image, category, dish_ingredients } = request.body


    if (!name || !description || !price || !category) {
      throw new AppError("Não foi possivel cadastrar o prato, verifique se inseriu todas as informações")
    }

    const dish_id = await knex("dish").insert({
      name,
      description,
      price,
      category,
      image
    })

    const dishIngredientsInsert = dish_ingredients.map(dishIngredient => {
      return {
        dish_id,
        ingredient_id: dishIngredient
      }
    })

    await knex("dish_ingredients").insert(dishIngredientsInsert)

    return response.json("Prato salvo com sucesso");
  }
}

module.exports = DishController