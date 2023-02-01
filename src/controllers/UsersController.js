const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { hash } = require("bcrypt")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password.lenght >= 6) {
      throw new AppError ("Não foi possivel fazer cadastro, verifique as informações inseridas.")
    }

    const userExist = await knex.select("email")
    .where({ email })
    .from("users")
    .first()

    if(userExist){
      throw new AppError("Este email já está em uso")
    }

    const hashedPassword = await hash(password, 8)
    
    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    })

    return response.json();
  }


}

module.exports = UsersController