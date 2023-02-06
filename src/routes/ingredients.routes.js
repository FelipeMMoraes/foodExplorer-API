const { Router } = require("express");

const IngredientsController = require("../controllers/IngredientsController")

const ingredientsRoutes = Router();

const ingredientsController = new IngredientsController()

ingredientsRoutes.delete("/:id", ingredientsController.delete)
ingredientsRoutes.post("/", ingredientsController.create)
ingredientsRoutes.get("/", ingredientsController.index)

module.exports = ingredientsRoutes;