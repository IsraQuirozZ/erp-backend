const direccionService = require("../services/direccion.service");

const getDirecciones = async (req, res) => {
  try {
    const direcciones = await direccionService.getAllDirecciones();
    res.json(direcciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener direcciones" });
  }
};

const getDireccion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const direccion = await direccionService.getDireccionById(id);

    if (!direccion) {
      return res
        .status(404)
        .json({ error: `Dirección con id: ${id}, no encontrada.` });
    }

    res.json(direccion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener dirección" });
  }
};

const createDireccion = async (req, res) => {
  try {
    const direccion = await direccionService.createDireccion(req.body);
    res.status(201).json(direccion);
  } catch (error) {
    res.status(500).json({ error: "Error al crear dirección" });
  }
};

const updateDireccion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const direccion = await direccionService.updateDireccion(id, req.body);

    if (!direccion) {
      return res
        .status(404)
        .json({ error: `Dirección con id: ${id} no encontrada` });
    }

    res.json(direccion);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar dirección" });
  }
};

const deleteDireccion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const direccion = await direccionService.deleteDireccion(id);

    if (!direccion) {
      return res
        .status(404)
        .json({ error: `Dirección con id: ${id} no encontrada` });
    }

    res.json(direccion);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar dirección" });
  }
};

module.exports = {
  getDirecciones,
  getDireccion,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};
