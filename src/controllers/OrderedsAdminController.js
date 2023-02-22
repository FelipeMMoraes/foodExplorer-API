const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const statusValidation = require("../middlewares/statusValidation");

class OrderedsAdminController{
  async show(_request, response){
    const orders = await knex('ordereds')

    return response.json(orders)
  }

  async update(request, response){
    const { user_id, id } = request.params
    const { status } = request.body

    const user = await knex("users").where({ id: user_id }).select().first()
    // user = usuario e suas info

    if(!user.isAdmin){
      throw new AppError("Não é possivel atualizar os pedidos com uma conta cliente")
    }

    if(statusValidation) {
      await knex("ordereds").where({ id }).update({ status, updated_at: knex.fn.now() })
    }
    
    return response.json()
  }

}

module.exports = OrderedsAdminController