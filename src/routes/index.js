const { Router } = require("express")

const orderedsRouter = require("./ordereds.routes")
const usersRouter = require("./user.routes")
const dishRouter = require("./dish.routes")

const routes = Router()
routes.use("/ordereds", orderedsRouter)
routes.use("/users", usersRouter)
routes.use("/dish", dishRouter)

module.exports = routes;