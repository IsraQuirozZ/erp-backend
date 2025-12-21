const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const {
  validateCreateClient,
  validateUpdateClient,
} = require("../validators/client.validator");

router.get("/", clientController.getClients);
router.get("/:id", clientController.getClient);
router.post("/", validateCreateClient, clientController.createClient);
router.put("/:id", validateUpdateClient, clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

module.exports = router;
