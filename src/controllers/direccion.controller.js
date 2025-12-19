const direccionService = require("../services/direccion.service");

const getDirecciones = async (req, res, next) => {
  try {
    const direcciones = await direccionService.getAllDirecciones();
    res.json(direcciones);
  } catch (error) {
    next(error);
  }
};

const getDireccion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const direccion = await direccionService.getDireccionById(id);
    res.json(direccion);
  } catch (error) {
    next(error);
  }
};

const createDireccion = async (req, res, next) => {
  try {
    const direccion = await direccionService.createDireccion(req.body);
    res.status(201).json(direccion);
  } catch (error) {
    next(error);
  }
};

const updateDireccion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const direccion = await direccionService.updateDireccion(id, req.body);
    res.json(direccion);
  } catch (error) {
    next(error);
  }
};

const deleteDireccion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const direccion = await direccionService.deleteDireccion(id);
    res.json({
      message: `Dirección: "${direccion.calle}, ${direccion.numero}" con id "${direccion.id_direccion}" eliminada correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDirecciones,
  getDireccion,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};
