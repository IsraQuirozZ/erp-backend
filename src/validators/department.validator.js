const { capitalize, CapitalizeFirstLetter } = require("../utils/string.utils");
const { onlyLettersRegex } = require("../utils/regex.utils");

const validateCreateDepartment = async (req, res, next) => {
  const { name, desc } = req.body;

  // NAME
  if (!name || typeof name !== "string" || name.length < 2) {
    return res.status(400).json({
      error: "The department name must be a non-empty string",
    });
  }

  if (!onlyLettersRegex.test(name.trim())) {
    return res.status(400).json({
      error: "The department name must contain only letters and spaces",
    });
  }

  // DESC
  if (desc !== undefined) {
    if (typeof desc !== "string") {
      return res
        .status(400)
        .json({ error: "The department description must be a string" });
    }
  }

  const normalizedName = name?.trim();
  const normalizedDesc = desc?.trim();

  req.body.name = capitalize(normalizedName);
  if (desc) req.body.desc = CapitalizeFirstLetter(normalizedDesc);
  next();
};

const validateUpdateDepartment = async (req, res, next) => {
  const { name, desc } = req.body;

  if (name === undefined && desc === undefined) {
    return res.status(400).json({
      error: "At least one field must be provided to update the department",
    });
  }

  // NAME
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "The department name must be a non-empty string" });
    }

    if (!onlyLettersRegex.test(name.trim())) {
      return res
        .status(400)
        .json({ error: "The department name must contain only letters" });
    }

    req.body.name = capitalize(name.trim());
  }

  // DESC
  if (desc !== undefined && typeof desc !== "string") {
    return res
      .status(400)
      .json({ error: "The deparment description must be a string" });
  }

  if (desc !== undefined) req.body.desc = CapitalizeFirstLetter(desc.trim());
  next();
};

module.exports = {
  validateCreateDepartment,
  validateUpdateDepartment,
};
