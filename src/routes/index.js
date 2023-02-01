const { Router } = require("express")

const usersRouter = require("./user.routes")
const orderedsRouter = require("./ordereds.routes")

const routes = Router()
routes.use("/users", usersRouter)
routes.use("/ordereds", orderedsRouter)

module.exports = routes;