const { Router } = require("express");

const DishController = require("../controllers/DishController")

const dishRoutes = Router();

const dishController = new DishController()

dishRoutes.delete("/:id", dishController.delete)
dishRoutes.post("/", dishController.create)
dishRoutes.get("/:id", dishController.show)
dishRoutes.get("/", dishController.index)

module.exports = dishRoutes;