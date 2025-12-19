const { capitalize } = require("../utils/string.utils");

const validateCreateDireccion = (req, res, next) => {
  const { calle, numero, codigo_postal, id_provincia } = req.body;

  // CALLE
  if (!calle || typeof calle !== "string" || calle.trim().length === 0) {
    return res.status(400).json({
      error: "La calle es obligatoria y debe ser un texto válido",
    });
  }

  // CÓDIGO POSTAL
  if (
    !codigo_postal ||
    typeof codigo_postal !== "string" ||
    codigo_postal.trim().length === 0
  ) {
    return res.status(400).json({
      error: "El código postal es obligatorio y debe ser un texto válido",
    });
  }

  if (!/^[0-9]{5}$/.test(codigo_postal)) {
    return res.status(400).json({
      error: "El código postal debe tener 5 dígitos",
    });
  }

  // ID_PROVINCIA
  if (!id_provincia || typeof id_provincia !== "number") {
    return res.status(400).json({
      error: "El id de Provincia es obligatorio y debe ser numérico",
    });
  }

  // NUMERO
  if (!numero || typeof numero !== "string" || numero.trim().length === 0) {
    return res.status(400).json({
      error: "El número es obligatorio y debe ser un String",
    });
  }

  // NORMALIZACIÓN
  req.body.calle = capitalize(calle.trim());
  req.body.codigo_postal = codigo_postal.trim();
  req.body.numero = numero.trim();

  next();
};

const validateUpdateDireccion = (req, res, next) => {
  const { calle, numero, codigo_postal, id_provincia } = req.body;

  if (
    calle === undefined &&
    numero === undefined &&
    codigo_postal === undefined &&
    id_provincia === undefined
  ) {
    return res.status(400).json({
      error: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  if (calle !== undefined) {
    if (typeof calle !== "string" || calle.trim().length === 0) {
      return res.status(400).json({
        error: "La calle debe ser un texto válido",
      });
    }
    req.body.calle = capitalize(calle.trim());
  }

  if (codigo_postal !== undefined) {
    if (
      typeof codigo_postal !== "string" ||
      codigo_postal.trim().length === 0
    ) {
      return res.status(400).json({
        error: "El código postal debe ser un texto válido",
      });
    }
    req.body.codigo_postal = codigo_postal.trim();
  }

  if (numero !== undefined) {
    if (typeof numero !== "string") {
      return res.status(400).json({
        error: "El número debe ser un texto",
      });
    }
    req.body.numero = numero.trim();
  }

  if (id_provincia !== undefined && typeof id_provincia !== "number") {
    return res.status(400).json({
      error: "El id de provincia debe ser numérico",
    });
  }

  next();
};

module.exports = {
  validateCreateDireccion,
  validateUpdateDireccion,
};
