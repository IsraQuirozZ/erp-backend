const express = require("express");
const router = express.Router();
const provinciaController = require("../controllers/provincia.controller");
const {
  validateCreateProvincia,
  validateUpdateProvincia,
} = require("../validators/provincia.validator");

router.get("/", provinciaController.getProvincias);
router.get("/:id", provinciaController.getProvincia);
// 👇 validación ANTES del controller
router.post("/", validateCreateProvincia, provinciaController.createProvincia);
router.put(
  "/:id",
  validateUpdateProvincia,
  provinciaController.updateProvincia
);
router.delete("/:id", provinciaController.deleteProvincia);

module.exports = router;
