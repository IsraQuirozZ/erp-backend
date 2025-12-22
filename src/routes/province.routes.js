const express = require("express");
const router = express.Router();
const provinceController = require("../controllers/province.controller");
const {
  validateCreateProvince,
  validateUpdateProvince,
} = require("../validators/province.validator");

router.get("/", provinceController.getProvinces);
router.get("/:id", provinceController.getProvince);
// 👇 Validation BEFORE controller
router.post("/", validateCreateProvince, provinceController.createProvince);
router.put("/:id", validateUpdateProvince, provinceController.updateProvince);
router.delete("/:id", provinceController.deleteProvince);

module.exports = router;
