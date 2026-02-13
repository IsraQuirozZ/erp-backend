const componentInventoryService = require("../services/component-inventory.service");
// GET COMPONENT INVENTORY BY ID
const getInventoryById = async (req, res, next) => {
  try {
    const id_component = Number(req.params.id_component);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await componentInventoryService.getInventoryById(
      id_component,
      id_warehouse,
    );
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

// UPDATE COMPONENT INVENTORY (MIN/MAX STOCK)
const updateComponentInventory = async (req, res, next) => {
  try {
    const id_component = Number(req.params.id_component);
    const id_warehouse = Number(req.params.id_warehouse);
    await componentInventoryService.updateComponentInventory(
      id_component,
      id_warehouse,
      req.body,
    );
    res.json({ message: "Inventory updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventoryById,
  updateComponentInventory,
};
