const shipmentService = require("../services/shipment.service");

const getAllShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getAllShipments();
    res.json(shipments);
  } catch (error) {
    next(error);
  }
};

const getShipmentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const shipment = await shipmentService.getShipmentById(id);
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body);
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

const updateShipmentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const shipment = await shipmentService.updateShipmentById(id, req.body);
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

const deleteShipmentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const shipment = shipmentService.deleteShipmentById(id);
    res.json({
      message: `Shipment - ${(await shipment).id_shipment} - successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipmentById,
  deleteShipmentById,
};
