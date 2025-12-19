const express = require("express");
const router = express.Router();
const direccionController = require("../controllers/direccion.controller");
const {
  validateCreateDireccion,
  validateUpdateDireccion,
} = require("../validators/direccion.validator");

router.get("/", direccionController.getDirecciones);

router.get("/:id", direccionController.getDireccion);

router.post("/", validateCreateDireccion, direccionController.createDireccion);

router.put(
  "/:id",
  validateUpdateDireccion,
  direccionController.updateDireccion
);

router.delete("/:id", direccionController.deleteDireccion);

module.exports = router;
