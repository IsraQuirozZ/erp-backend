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

// GET PRODUCT COMPONENT BY ID
const getProductComponentById = async (req, res, next) => {
  try {
    const id_product = Number(req.params.id_product);
    const id_component = Number(req.params.id_component);

    const component = await productComponentService.getProductComponentById(
      id_product,
      id_component,
    );
    res.json(component);
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

// UPDATE PRODUCT COMPONENT
const updateProductComponent = async (req, res, next) => {
  try {
    const id_product = Number(req.params.id_product);
    const id_component = Number(req.params.id_component);
    const { quantity } = req.body;

    const updatedComponent =
      await productComponentService.updateProductComponent(
        id_product,
        id_component,
        quantity,
      );
    res.json(updatedComponent);
  } catch (error) {
    next(error);
  }
};

const deleteProductComponent = async (req, res, next) => {
  try {
    const id_product = Number(req.params.id_product);
    const id_component = Number(req.params.id_component);

    const deletedComponent =
      await productComponentService.deleteProductComponent(
        id_product,
        id_component,
      );
    res.json({
      message: `Product Component (${deletedComponent.component.name}) deleted successfully `,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductComponents,
  getProductComponentById,
  createProductComponent,
  updateProductComponent,
  deleteProductComponent,
};
