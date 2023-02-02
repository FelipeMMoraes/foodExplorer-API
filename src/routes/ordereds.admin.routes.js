const { Router } = require("express");
const statusValidation = require("../middlewares/statusValidation");

const OrderedsAdminController = require("../controllers/OrderedsAdminController");

const orderedsAdminRoutes = Router();

const orderedsAdminController = new OrderedsAdminController()

orderedsAdminRoutes.get("/", orderedsAdminController.show)
orderedsAdminRoutes.put("/:user_id/:id", statusValidation, orderedsAdminController.update)

module.exports = orderedsAdminRoutes;