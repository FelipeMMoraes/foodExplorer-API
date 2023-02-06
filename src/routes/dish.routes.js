const { Router } = require("express");

const DishController = require("../controllers/DishController")

const dishRoutes = Router();

const dishController = new DishController()

dishRoutes.post("/", dishController.create)
// dishRoutes.put("/:id", dishController.update)

module.exports = dishRoutes;