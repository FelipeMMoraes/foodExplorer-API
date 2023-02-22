const { Router } = require("express");

const FavsController = require("../controllers/FavsController")

const favRoutes = Router();

const favsController = new FavsController()

favRoutes.delete("/:user_id", favsController.delete)
favRoutes.get("/:user_id", favsController.index)
favRoutes.post("/", favsController.create)

module.exports = favRoutes;