const express = require("express");
const router = express.Router();
const direccionController = require("../controllers/direccion.controller");

router.get("/", direccionController.getDirecciones);
router.get("/:id", direccionController.getDireccion);
router.post("/", direccionController.createDireccion);
router.put("/:id", direccionController.updateDireccion);
router.delete("/:id", direccionController.deleteDireccion);

module.exports = router;
