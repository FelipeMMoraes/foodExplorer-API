const { Router } = require("express");

const DishController = require("../controllers/DishController")

const dishRoutes = Router();

const dishController = new DishController()

dishRoutes.delete("/:id", dishController.delete)
dishRoutes.put("/:id", dishController.update)
dishRoutes.get("/:id", dishController.show)
dishRoutes.post("/", dishController.create)
dishRoutes.get("/", dishController.index)

module.exports = dishRoutes;