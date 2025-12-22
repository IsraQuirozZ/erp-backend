const { capitalize } = require("../utils/string.utils");
const { onlyLettersRegex, onlyNumbersRegex } = require("../utils/regex.utils");

const validateCreateAddress = (req, res, next) => {
  const {
    street,
    number,
    portal,
    floor,
    door,
    city,
    postal_code,
    id_province,
  } = req.body;

  // street
  if (!street || typeof street !== "string" || street.trim().length === 0) {
    return res.status(400).json({
      error: "The address street must be a non-empty string",
    });
  }

  // number
  if (!number || typeof number !== "string" || number.trim().length === 0) {
    return res.status(400).json({
      error: "The address number must be a non-empty string",
    });
  }

  if (!onlyNumbersRegex.test(number.trim())) {
    return res.status(400).json({
      error: "The address number must contain only digits",
    });
  }

  // portal -> OPTIONAL
  if (portal !== undefined && typeof portal !== "string") {
    return res.status(400).json({
      error: "The address portal must be a string",
    });
  }

  // floor -> OPTIONAL
  if (floor !== undefined && typeof floor !== "string") {
    return res.status(400).json({
      error: "The address floor must be a string",
    });
  }

  // door -> OPTIONAL
  if (door !== undefined && typeof door !== "string") {
    return res.status(400).json({
      error: "The address door must be a string",
    });
  }

  // city
  if (
    !city ||
    typeof city !== "string" ||
    city.trim().length === 0 ||
    !onlyLettersRegex.test(city.trim())
  ) {
    return res.status(400).json({
      error: "The city must be a non-empty string",
    });
  }

  // postal code
  if (
    !postal_code ||
    typeof postal_code !== "string" ||
    postal_code.trim().length === 0
  ) {
    return res.status(400).json({
      error: "The postal code must be a non-empty string",
    });
  }

  if (!/^[0-9]{5}$/.test(postal_code.trim())) {
    return res.status(400).json({
      error: "The postal code must have 5 digits",
    });
  }

  // id_province
  if (!id_province || typeof id_province !== "number") {
    return res.status(400).json({
      error: "Province ID si mandatory and must be a number",
    });
  }

  // normalize
  req.body.street = capitalize(street.trim());
  req.body.number = number.trim();
  if (portal) req.body.portal = portal.trim();
  if (floor) req.body.floor = floor.trim();
  if (door) req.body.door = door.trim();
  req.body.city = capitalize(city.trim());
  req.body.postal_code = postal_code.trim();

  next();
};

const validateUpdateAddress = (req, res, next) => {
  const {
    street,
    number,
    portal,
    floor,
    door,
    city,
    postal_code,
    id_province,
  } = req.body;

  if (
    street === undefined &&
    number === undefined &&
    portal === undefined &&
    floor === undefined &&
    door === undefined &&
    city === undefined &&
    postal_code === undefined &&
    id_province === undefined
  ) {
    return res.status(400).json({
      error: "At least one field must be provided to update the province",
    });
  }

  // street
  if (street !== undefined) {
    if (typeof street !== "string" || street.trim().length === 0) {
      return res.status(400).json({
        error: "The street must be a non-empty string",
      });
    }
    req.body.street = capitalize(street.trim());
  }

  // number
  if (number !== undefined) {
    if (typeof number !== "string" || number.trim().length === 0) {
      return res.status(400).json({
        error: "The number must be a non-empty string",
      });
    }

    if (!onlyNumbersRegex.test(number.trim())) {
      return res.status(400).json({
        error: "The number must contain only digits",
      });
    }

    req.body.number = number.trim();
  }

  // PORTAL
  if (portal !== undefined && typeof portal !== "string") {
    return res.status(400).json({ error: "invalid portal" });
  }

  // floor
  if (floor !== undefined && typeof floor !== "string") {
    return res.status(400).json({ error: "invalid floor" });
  }

  // door
  if (door !== undefined && typeof door !== "string") {
    return res.status(400).json({ error: "invalid door" });
  }

  // city
  if (city !== undefined) {
    if (
      typeof city !== "string" ||
      city.trim().length === 0 ||
      !onlyLettersRegex.test(city.trim())
    ) {
      return res.status(400).json({
        error: "The city must be a non-empty string",
      });
    }
    req.body.city = capitalize(city.trim());
  }

  // CÓDIGO POSTAL
  if (postal_code !== undefined) {
    if (typeof postal_code !== "string" || postal_code.trim().length === 0) {
      return res.status(400).json({
        error: "The postal code must be a non-empty string",
      });
    }

    if (!/^[0-9]{5}$/.test(postal_code.trim())) {
      return res.status(400).json({
        error: "The postal code must have 5 digits",
      });
    }

    req.body.postal_code = postal_code.trim();
  }

  if (id_province !== undefined && typeof id_province !== "number") {
    return res.status(400).json({
      error: "The province id must be a non-empty number",
    });
  }

  next();
};

module.exports = {
  validateCreateAddress,
  validateUpdateAddress,
};
