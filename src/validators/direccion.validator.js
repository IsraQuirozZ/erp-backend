const { capitalize } = require("../utils/string.utils");
const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const onlyNumbersRegex = /^[0-9]+$/;

const validateCreateDireccion = (req, res, next) => {
  const {
    calle,
    numero,
    portal,
    piso,
    puerta,
    municipio,
    codigo_postal,
    id_provincia,
  } = req.body;

  // CALLE
  if (!calle || typeof calle !== "string" || calle.trim().length === 0) {
    return res.status(400).json({
      error: "La calle es obligatoria y debe ser un texto válido",
    });
  }

  // NUMERO
  if (!numero || typeof numero !== "string" || numero.trim().length === 0) {
    return res.status(400).json({
      error: "El número es obligatorio y debe ser un texto válido",
    });
  }

  if (!onlyNumbersRegex.test(numero)) {
    return res.status(400).json({
      error: "El numero solo puede contener dígitos",
    });
  }

  // PORTAL -> NO OBLIGATORIO
  if (portal !== undefined && typeof portal !== "string") {
    return res.status(400).json({
      error: "El portal debe ser un texto válido",
    });
  }

  // PISO -> NO OBLIGATORIO
  if (piso !== undefined && typeof piso !== "string") {
    return res.status(400).json({
      error: "El piso debe ser un texto válido",
    });
  }

  // PUERTA -> NO OBLIGATORIO
  if (puerta !== undefined && typeof puerta !== "string") {
    return res.status(400).json({
      error: "La puerta debe ser un texto válido",
    });
  }

  // MUNICIPIO
  if (
    !municipio ||
    typeof municipio !== "string" ||
    municipio.trim().length === 0 ||
    !onlyLettersRegex.test(municipio.trim())
  ) {
    return res.status(400).json({
      error: "El municipio es obligatorio y debe ser un texto válido",
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

  // NORMALIZACIÓN
  req.body.calle = capitalize(calle.trim());
  req.body.numero = numero.trim();
  if (portal) req.body.portal = portal.trim();
  if (piso) req.body.piso = piso.trim();
  if (puerta) req.body.puerta = puerta.trim();
  req.body.municipio = capitalize(municipio.trim());
  req.body.codigo_postal = codigo_postal.trim();

  next();
};

const validateUpdateDireccion = (req, res, next) => {
  const {
    calle,
    numero,
    portal,
    piso,
    puerta,
    municipio,
    codigo_postal,
    id_provincia,
  } = req.body;

  if (
    calle === undefined &&
    numero === undefined &&
    portal === undefined &&
    piso === undefined &&
    puerta === undefined &&
    municipio === undefined &&
    codigo_postal === undefined &&
    id_provincia === undefined
  ) {
    return res.status(400).json({
      error: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  // CALLE
  if (calle !== undefined) {
    if (typeof calle !== "string" || calle.trim().length === 0) {
      return res.status(400).json({
        error: "La calle debe ser un texto válido",
      });
    }
    req.body.calle = capitalize(calle.trim());
  }

  // NUMERO
  if (numero !== undefined) {
    if (typeof numero !== "string" || numero.trim().length === 0) {
      return res.status(400).json({
        error: "El número debe ser un texto válido",
      });
    }

    if (!onlyNumbersRegex.test(numero)) {
      return res.status(400).json({
        error: "El número solo puede contener dígitos",
      });
    }

    req.body.numero = numero.trim();
  }

  // PORTAL
  if (portal !== undefined && typeof portal !== "string") {
    return res.status(400).json({ error: "Portal inválido" });
  }

  // PISO
  if (piso !== undefined && typeof piso !== "string") {
    return res.status(400).json({ error: "Piso inválido" });
  }

  // PUERTA
  if (puerta !== undefined && typeof puerta !== "string") {
    return res.status(400).json({ error: "Puerta inválida" });
  }

  // MUNICIPIO
  if (municipio !== undefined) {
    if (
      typeof municipio !== "string" ||
      municipio.trim().length === 0 ||
      !onlyLettersRegex.test(municipio.trim())
    ) {
      return res.status(400).json({
        error: "El municipio es obligatorio y debe ser un texto válido",
      });
    }
    req.body.municipio = capitalize(municipio.trim());
  }

  // CÓDIGO POSTAL
  if (codigo_postal !== undefined) {
    if (
      typeof codigo_postal !== "string" ||
      codigo_postal.trim().length === 0
    ) {
      return res.status(400).json({
        error: "El código postal debe ser un texto válido",
      });
    }

    if (!/^[0-9]{5}$/.test(codigo_postal)) {
      return res.status(400).json({
        error: "El código postal debe tener 5 dígitos",
      });
    }

    req.body.codigo_postal = codigo_postal.trim();
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
