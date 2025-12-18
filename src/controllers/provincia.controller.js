const provinciaService = require("../services/provincia.service");

// Consultar todas las provincias
const getProvincias = async (req, res, next) => {
  try {
    const provincias = await provinciaService.getAllProvincias();
    res.json(provincias);
  } catch (error) {
    next(error);
  }
};

// Consultar provincia por ID
const getProvincia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const provincia = await provinciaService.getProvinciaById(id);
    res.json(provincia);
  } catch (error) {
    next(error);
  }
};

// Crear provincia
const createProvincia = async (req, res, next) => {
  try {
    const provincia = await provinciaService.createProvincia(req.body);
    res.status(201).json(provincia);
  } catch (error) {
    next(error);
  }
};

// Actualizar provincia
const updateProvincia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const provincia = await provinciaService.updateProvincia(id, req.body);
    res.json(provincia);
  } catch (error) {
    next(error);
  }
};

// Eliminar Provincia
const deleteProvincia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const provincia = await provinciaService.deleteProvincia(id);

    res.json({
      message: `Provincia "${provincia.nombre}" con id ${provincia.id_provincia} eliminada correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProvincias,
  getProvincia,
  createProvincia,
  updateProvincia,
  deleteProvincia,
};
