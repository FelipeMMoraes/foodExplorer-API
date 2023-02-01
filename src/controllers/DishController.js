const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishController{
  async create(request, response){
    const { name, description, price, image, category } = request.body


    if(!name || !description || !price){
      throw new AppError("Não foi possivel cadastrar o prato, verifique se inseriu todas as informações")
    }

    const dish_id = await knex("dish").insert({
      name,
      description,
      price,
      category,
      image : null
    })

    return response.json()
  }
}

module.exports = DishController