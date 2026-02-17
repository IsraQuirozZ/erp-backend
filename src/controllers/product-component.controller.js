const productComponentService = require("../services/product-component.service");

// GET ALL PRODUCT COMPONENTS
const getAllProductComponents = async (req, res, next) => {
  try {
    const components = await productComponentService.getAllProductComponents();
    res.json(components);
  } catch (error) {
    next(error);
  }
};

// CREATE PRODUCT COMPONENT
const createProductComponent = async (req, res, next) => {
  try {
    const component = await productComponentService.createProductComponent(
      req.body,
    );
    res.json(component);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductComponents,
  createProductComponent,
};
