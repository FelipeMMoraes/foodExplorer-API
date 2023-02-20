const { Router } = require("express");

const DishController = require("../controllers/DishController")

const dishRoutes = Router();

const dishController = new DishController()

dishRoutes.post("/", dishController.create)
dishRoutes.delete("/:id", dishController.delete)
dishRoutes.get("/:id", dishController.show)

module.exports = dishRoutes;