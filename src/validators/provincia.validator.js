const { capitalize } = require("../utils/string.utils");

// VALIDADOR PARA CREATEPROVINCIA
const validateCreateProvincia = (req, res, next) => {
  const { nombre } = req.body;

  // 1. Existe
  if (!nombre) {
    return res.status(400).json({
      error: "El nombre de la provincia es obligatorio",
    });
  }

  // 2. Es string
  if (typeof nombre !== "string") {
    return res.status(400).json({
      error: "El nombre de la provincia debe ser String",
    });
  }

  // 3. No vacío
  if (nombre.trim().length === 0) {
    return res.status(400).json({
      error: "El nombre de la provincia no puede estar vacío",
    });
  }

  // Normalizamos
  req.body.nombre = capitalize(nombre.trim());

  next(); // todo OK
};

// VALIDADOR PARA UPDATEPROVINCIA
const validateUpdateProvincia = (req, res, next) => {
  const { nombre } = req.body;

  // Si no viene nada → error
  if (!nombre) {
    return res.status(400).json({
      error: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  // Si viene nombre, validarlo
  if (nombre !== undefined) {
    if (typeof nombre !== "string") {
      return res.status(400).json({
        error: "El nombre de la provincia debe ser String",
      });
    }

    if (nombre.trim().length === 0) {
      return res.status(400).json({
        error: "El nombre de la provincia no puede estar vacío",
      });
    }

    req.body.nombre = capitalize(nombre.trim());
  }

  next();
};

module.exports = {
  validateCreateProvincia,
  validateUpdateProvincia,
};
