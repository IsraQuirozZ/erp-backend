const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  validateCreateUser,
  validateLogin,
} = require("../validators/auth.validator");

// router.get("/")

router.post("/register", validateCreateUser, authController.registerAdmin);

router.post("/login", validateLogin, authController.login);

module.exports = router;
