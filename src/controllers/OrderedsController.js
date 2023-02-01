const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrderedsController{

  async create(request, response){
    const { statusCode, statusDescription } = request.body;
    const { user_id } = request.params;

    if(!statusCode || !statusDescription) {
      throw new AppError("Não foi possivel realizar o pedido, por favor verifique as informações")
    }

    await knex("ordereds").insert({
      statusCode,
      statusDescription,
      user_id
    })
    
    return response.json('pedido feito com sucesso')
  }

  async index(request, response){
    const { user_id } = request.params

    const ordered = await knex("ordereds").where({ user_id })

    return response.json(ordered)
  }
}

module.exports = OrderedsController