const { Router } = require("express")

const orderedsAdminRouter = require("./ordereds.admin.routes")
const ingredientsRouter = require("./ingredients.routes")
const orderedsRouter = require("./ordereds.routes")
const usersRouter = require("./user.routes")
const dishRouter = require("./dish.routes")
const favsRouter = require("./favs.routes")

const routes = Router()
routes.use("/orderedsadmin", orderedsAdminRouter)
routes.use("/ingredients", ingredientsRouter)
routes.use("/ordereds", orderedsRouter)
routes.use("/users", usersRouter)
routes.use("/dish", dishRouter)
routes.use("/favs", favsRouter)

module.exports = routes;