const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController {
  async create(request, response){
    const { name, image } = request.body;

    if(!name || !image){
      throw new AppError("Impossivel cadastrar o ingrediente, verifique se adicionou todas as informações")
    };

    const ingredientExist = await knex("ingredients").where({ name }).first();
    if(ingredientExist){
      throw new AppError(`Já existe um ingrediente com o nome ${name}`)
    }

    const ingredient_id = await knex("ingredients").insert({
      name,
      image
    })

    return response.json({ ingredient_id, message: `Ingrediente ${name} salvo com sucesso` })
  }

  async delete(request, response){
    const { id } = request.params

    const ingredients = await knex("ingredients").where({ id }).first();

    if(!ingredients){
      throw new AppError("Ingrediente não encontrado")
    }

    await knex("ingredients").where({ id }).del();

    return response.json({
      message: `Ingrediente ${ingredients.name} deletado com sucesso.`
    })
  }

  async index(_request, response){
    const ingredients = await knex("ingredients").select("*");

    return response.json({ ingredients })
  }
}

module.exports = IngredientsController

