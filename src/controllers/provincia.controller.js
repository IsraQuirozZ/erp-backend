const { parse } = require("dotenv");
const provinciaService = require("../services/provincia.service");
const { provincia } = require("../config/prisma");

// Consultar todas las provincias
const getProvincias = async (req, res) => {
  try {
    const provincias = await provinciaService.getAllProvincias();
    res.json(provincias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener provincias" });
  }
};

// Consultar provincia por ID
const getProvincia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const provincia = await provinciaService.getProvinciaById(id);

    if (!provincia) {
      return res.status(404).json({ error: "Provincia no encontrada" });
    }

    res.json(provincia);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener provincia" });
  }
};

// Crear provincia
const createProvincia = async (req, res) => {
  try {
    const provincia = await provinciaService.createProvincia(req.body);
    res.status(201).json(provincia);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Ya existe una provincia con ese nombre",
      });
    }

    res.status(500).json({ error: "Error al crear provincia" });
  }
};

// Actualizar provincia
const updateProvincia = async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Confirmar que existe la provincia
    const provincia = await provinciaService.updateProvincia(id, req.body);
    if (!provincia) {
      return res.status(404).json({ error: "Provincia no encontrada" });
    }

    res.json(provincia);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar provincia" });
  }
};

// Borrar provincia
const deleteProvincia = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const provincia = await provinciaService.deleteProvincia(id);

    if (!provincia) {
      return res.status(404).json({ error: "Provincia no encontrada" });
    }

    res.json({
      message: `Provincia: ${provincia.nombre} con id: ${provincia.id_provincia} eliminada correctamente`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar provincia" });
  }
};

module.exports = {
  getProvincias,
  getProvincia,
  createProvincia,
  updateProvincia,
  deleteProvincia,
};
