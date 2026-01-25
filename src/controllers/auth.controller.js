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

    const roles = user.roles.map((ur) => ur.role.name);

    const token = jwt.sign(
      {
        id_user: user.id_user,
        username: user.username,
        roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      token,
      user: {
        id_user: user.id_user,
        username: user.username,
        roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerAdmin,
  login,
};
