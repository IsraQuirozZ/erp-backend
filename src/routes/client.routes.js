const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const {
  validateCreateClient,
  validateUpdateClient,
  validateCreateFullClient,
  validateUpdateFullClient,
} = require("../validators/client.validator");

router.get("/", clientController.getClients);
router.get("/:id", clientController.getClient);
router.post("/", validateCreateClient, clientController.createClient);

// USE CASE
router.post(
  "/full",
  validateCreateFullClient,
  clientController.createFullClient,
);

router.put("/:id", validateUpdateClient, clientController.updateClient);

// USE CASE
router.put(
  "/full/:id",
  validateUpdateFullClient,
  clientController.updateFullClient,
);

router.delete("/:id", clientController.deleteClientById);

module.exports = router;
