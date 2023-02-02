const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrderedsAdminController{
  async show(request, response){
    const orders = await knex('ordereds')

    return response.json(orders)
  }

  async update(request, response){
    const { user_id, id } = request.params
    const { statusCode, statusDescription } = request.body

    const user = await knex("users").where({ id: user_id }).select().first()
    // user = usuario e suas info

    if(!user.isAdmin){
      throw new AppError("Não é possivel atualizar os pedidos com uma conta cliente")
    }

    if(
      statusCode === "Aguardando" ||
      statusCode === "Preparando" ||
      statusCode === "Entregue"
    ) {
      await knex("ordereds").where({ id }).update({ statusCode, updated_at: knex.fn.now() })
      await knex("ordereds").where({ id }).update({ statusDescription, updated_at: knex.fn.now() })
    } else {
      throw new AppError("Não é possivel atualizar o pedido, verifique as informações")
    }

    return response.json()
  }

}

module.exports = OrderedsAdminController