const { Router } = require("express");

const OrderedsController = require("../controllers/OrderedsController")

const orderedRoutes = Router();

const orderedsController = new OrderedsController()

orderedRoutes.post("/:user_id", orderedsController.create)
orderedRoutes.get("/:user_id", orderedsController.index)

module.exports = orderedRoutes;