const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

const registerAdmin = async (req, res, next) => {
  try {
    const user = await authService.registerAdmin(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);

    const token = jwt.sign(
      {
        id_user: user.id_user,
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }, // 8h
    );

    res.json({
      token,
      user: {
        id_user: user.id_user,
        username: user.username,
        roles: user.roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, username, role } = req.body;

    const user = await authService.createUser({
      email,
      password,
      username,
      role,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAdmin,
  login,
  createUser,
};
