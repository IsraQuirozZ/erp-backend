const express = require("express");
const router = express.Router();
const provinciaController = require("../controllers/provincia.controller");

router.get("/", provinciaController.getProvincias);
router.get("/:id", provinciaController.getProvincia);
router.post("/", provinciaController.createProvincia);
router.put("/:id", provinciaController.updateProvincia);
router.delete("/:id", provinciaController.deleteProvincia);

module.exports = router;
