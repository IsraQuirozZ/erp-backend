const supplierProductInventoryService = require("../services/supplier-product-inventory.service");

const getAllInventories = async (req, res, next) => {
  try {
    const inventories =
      await supplierProductInventoryService.getAllInventories();
    res.json(inventories);
  } catch (error) {
    next(error);
  }
};

const getInventory = async (req, res, next) => {
  try {
    // ".../supplier-product/:id_supplier_product/warehouse/:id_warehouse"
    const id_supplier_product = Number(req.params.id_supplier_product);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await supplierProductInventoryService.getInventory(
      id_supplier_product,
      id_warehouse
    );
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const createSupplierProductInventory = async (req, res, next) => {
  try {
    const inventory =
      await supplierProductInventoryService.createSupplierProductInventory(
        req.body
      );

    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const id_supplier_product = Number(req.params.id_supplier_product);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await supplierProductInventoryService.updateInventory(
      id_supplier_product,
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
    const id_supplier_product = Number(req.params.id_supplier_product);
    const id_warehouse = Number(req.params.id_warehouse);
    const inventory = await supplierProductInventoryService.deleteInventory(
      id_supplier_product,
      id_warehouse
    );
    res.json({
      message: `Inventory -- (${inventory.id_supplier_product}, ${inventory.id_warehouse}) -- successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventories,
  getInventory,
  createSupplierProductInventory,
  updateInventory,
  deleteInventory,
};
