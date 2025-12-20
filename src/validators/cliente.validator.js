const { capitalize } = require("../utils/string.utils");
const {
  onlyLettersRegex,
  telefonoRegex,
  emailRegex,
} = require("../utils/regex.utils");

const validateCreateCliente = (req, res, next) => {
  const { nombre, apellidos, telefono, email, id_direccion } = req.body;

  // NOMBRE
  if (!nombre || typeof nombre !== "string" || nombre.trim().length < 3) {
    return res.status(400).json({
      error: "El nombre debe ser un texto válido y tener al menos 3 caracteres",
    });
  }

  if (!onlyLettersRegex.test(nombre.trim())) {
    return res.status(400).json({
      error: "El nombre no debe contener dígitos ni caracteres especiales",
    });
  }

  // APELLIDOS
  if (
    !apellidos ||
    typeof apellidos !== "string" ||
    apellidos.trim().length < 3
  ) {
    return res.status(400).json({
      error: "Debes introducir por lo menos un apellido",
    });
  }

  if (!onlyLettersRegex.test(apellidos.trim())) {
    return res.status(400).json({
      error: "Los apellidos no deben contener dígitos ni caracteres especiales",
    });
  }

  // TELEFONO
  if (
    !telefono ||
    typeof telefono !== "string" ||
    !telefonoRegex.test(telefono.trim())
  ) {
    return res.status(400).json({
      error: "El teléfono debe contener exactamente 9 dígitos",
    });
  }

  // EMAIL
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: "El email debe tener un formato valido",
    });
  }

  // ID_DIRECCION
  if (!id_direccion || typeof id_direccion !== "number") {
    return res
      .status(400)
      .json({ error: "El id de Dirección es obligatorio y debe ser numérico" });
  }

  req.body.nombre = capitalize(nombre.trim());
  req.body.apellidos = capitalize(apellidos.trim());
  req.body.telefono = telefono.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

const validateUpdateCliente = (req, res, next) => {
  const { nombre, apellidos, telefono, email, id_direccion } = req.body;

  if (
    nombre === undefined &&
    apellidos === undefined &&
    telefono === undefined &&
    email === undefined &&
    id_direccion === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Debes proporcionar al menos un campo para actualizar" });
  }

  // NOMBRE
  if (nombre !== undefined) {
    if (typeof nombre !== "string" || nombre.trim().length < 3) {
      return res.status(400).json({
        error:
          "El nombre debe ser un texto válido y tener al menos 3 caracteres",
      });
    }

    if (!onlyLettersRegex.test(nombre.trim())) {
      return res.status(400).json({
        error: "El nombre no debe contener dígitos ni caracteres especiales",
      });
    }

    req.body.nombre = capitalize(nombre.trim());
  }

  // APELLIDOS
  if (apellidos !== undefined) {
    if (typeof apellidos !== "string" || apellidos.trim().length < 3) {
      return res.status(400).json({
        error: "Debes introducir por lo menos un apellido",
      });
    }

    if (!onlyLettersRegex.test(apellidos.trim())) {
      return res.status(400).json({
        error:
          "Los apellidos no deben contener dígitos ni caracteres especiales",
      });
    }
    req.body.apellidos = capitalize(apellidos.trim());
  }

  //  TELEFONO
  if (telefono !== undefined) {
    if (typeof telefono !== "string" || !telefonoRegex.test(telefono.trim())) {
      return res.status(400).json({
        error: "El teléfono debe contener exactamente 9 dígitos",
      });
    }
    req.body.telefono = telefono.trim();
  }

  // EMAIL
  if (email !== undefined) {
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: "El email debe tener un formato valido",
      });
    }

    req.body.email = email.trim().toLowerCase();
  }

  // ID_DIRECCION
  if (id_direccion !== undefined && typeof id_direccion !== "number") {
    return res
      .status(400)
      .json({ error: "El id de Dirección debe ser numérico" });
  }

  next();
};

module.exports = {
  validateCreateCliente,
  validateUpdateCliente,
};
