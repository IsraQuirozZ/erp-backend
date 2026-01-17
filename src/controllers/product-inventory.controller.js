const productInventoryService = require("../services/product-inventory.service");

const getAllInventories = async (req, res, next) => {
  try {
    const inventories = await productInventoryService.getAllInventories();
    res.json(inventories);
  } catch (error) {
    next(error);
  }
};

const getInventory = async (req, res, next) => {
  try {
    // ".../product/:id_product/warehouse/:id_warehouse"
    const id_product = Number(req.params.id_product);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await productInventoryService.getInventory(
      id_product,
      id_warehouse
    );
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const createInventory = async (req, res, next) => {
  try {
    const inventory = await productInventoryService.createInventory(req.body);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const id_product = Number(req.params.id_product);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await productInventoryService.updateInventory(
      id_product,
      id_warehouse,
      req.body
    );

    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const deleteInventory = async (req, res, next) => {
  try {
    const id_product = Number(req.params.id_product);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await productInventoryService.deleteInventory(
      id_product,
      id_warehouse
    );
    res.json({
      message: `Inventory -- (${inventory.id_product}, ${inventory.id_warehouse}) -- successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
