const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavsController {
  async create(request, response) {
    const { user_id, dish_id } = request.body

    if(!user_id || !dish_id ){
      throw new AppError("Verifique se inseriu todas as informações para adicionar aos favoritos")
    }

    try {
      const fav = await knex("favs").insert({
        user_id,
        dish_id
      }).returning("*")

      return response.json(fav)
    } catch (error) {
      throw new AppError("Não foi possivel criar o favorito")
    }
  }

  async index(request, response) {
    const { user_id } = request.params;

    const favorites = await knex("favs")
      .select("favs.id", "users.name as user_name", "dish.name as dish_name")
      .leftJoin("users", "favs.user_id", "users.id")
      .leftJoin("dish", "favs.dish_id", "dish.id")
      .where("favs.user_id", user_id);

    return response.json(favorites);
  }

  async delete(request, response){
    const { id } = request.body
    const { user_id } = request.params

    const dishfav = await knex("favs").where({ id, user_id }).first();

    if(!dishfav){
      throw new AppError("Prato favorito nao encontrado")
    }

    await knex("favs").where({ id, user_id }).del();

    return response.json("Favorito deletado com sucesso")
  }
}

module.exports = FavsController