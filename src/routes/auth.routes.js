const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/requireRole.middleware");

const {
  validateRegisterAdmin,
  validateLogin,
  validateCreateUser,
} = require("../validators/auth.validator");

router.post("/register", validateRegisterAdmin, authController.registerAdmin);

router.post("/login", validateLogin, authController.login);

// Only ADMIN can create new Users
router.post(
  "/users",
  authMiddleware,
  requireRole("ADMIN"),
  validateCreateUser,
  authController.createUser,
);

module.exports = router;
