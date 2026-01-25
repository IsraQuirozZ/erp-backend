const { emailRegex, passwordRegex } = require("../utils/regex.utils");
const { capitalizeAll } = require("../utils/string.utils");
const { validateStringField } = require("../utils/validators.utils");

const validateRegisterAdmin = async (req, res, next) => {
  if (req.body.id_user !== undefined) {
    return res.status(400).json({ error: "User ID must not be provided" });
  }

  if (
    req.body.active !== undefined ||
    req.body.created_at !== undefined ||
    req.body.updated_at !== undefined ||
    req.body.deleted_at !== undefined
  ) {
    return res
      .status(400)
      .json({ error: "Some fields are mannaged automatically in the system" });
  }

  const { email, password, password2, username } = req.body;

  // EMAIL
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: "Email must be a valid email address",
    });
  }

  // PASSWORD
  if (!password2 || password.trim() !== password2.trim()) {
    return res.status(400).json({ error: "The passwords must match" });
  }

  if (
    !password ||
    typeof password !== "string" ||
    !passwordRegex.test(password.trim())
  ) {
    return res.status(400).json({
      error:
        "Password must be 9–12 characters long and include at least one uppercase letter, one number, and one special character.",
    });
  }

  // USERNAME
  try {
    if (username !== undefined) {
      req.body.username = validateStringField(username, "Username", {
        capitalizeFirst: true,
      });
    }
  } catch (error) {
    return next(error);
  }

  // NORMALIZE
  req.body.email = email.trim();
  req.body.password = password.trim();

  next();
};

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  // EMAIL
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: "Email must be a valid email address",
    });
  }

  // PASSWORD
  if (!password || typeof password !== "string" || password.trim().length < 1) {
    return res.status(400).json({ error: "Password must be provided" });
  }

  // NORMALIZE
  req.body.email = email.trim();
  req.body.password = password.trim();

  next();
};

const validateCreateUser = async (req, res, next) => {
  if (req.body.id_user !== undefined) {
    return res.status(400).json({ error: "User ID must not be provided" });
  }

  if (
    req.body.active !== undefined ||
    req.body.created_at !== undefined ||
    req.body.updated_at !== undefined ||
    req.body.deleted_at !== undefined
  ) {
    return res
      .status(400)
      .json({ error: "Some fields are mannaged automatically in the system" });
  }

  const { email, password, password2, username, role } = req.body;

  // EMAIL
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: "Email must be a valid email address",
    });
  }

  // PASSWORD
  if (!password2 || password.trim() !== password2.trim()) {
    return res.status(400).json({ error: "The passwords must match" });
  }

  if (
    !password ||
    typeof password !== "string" ||
    !passwordRegex.test(password.trim())
  ) {
    return res.status(400).json({
      error:
        "Password must be 9–12 characters long and include at least one uppercase letter, one number, and one special character.",
    });
  }

  // USERNAME
  try {
    req.body.username = validateStringField(username, "Username");

    // ROLE
    req.body.role = validateStringField(role, "Role", {
      onlyLetters: true,
    }).toUpperCase();
  } catch (error) {
    return next(error);
  }

  // NORMALIZE
  req.body.email = email.trim();
  req.body.password = password.trim();

  next();
};

module.exports = { validateRegisterAdmin, validateLogin, validateCreateUser };
