const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller");
const {
  validateCreateCliente,
  validateUpdateCliente,
} = require("../validators/cliente.validator");

router.get("/", clienteController.getClientes);
router.get("/:id", clienteController.getCliente);
router.post("/", validateCreateCliente, clienteController.createCliente);
router.put("/:id", validateUpdateCliente, clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;
