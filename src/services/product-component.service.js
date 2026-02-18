const prisma = require("../config/prisma");

// GET ALL PRODUCT COMPONENTS -> DEBUGGING PURPOSES
const getAllProductComponents = async () => {
  return await prisma.productComponent.findMany({
    include: { product: true },
  });
};

// GET PRODUCT COMPONENT BY ID
const getProductComponentById = async (id_product, id_component) => {
  const productComponent = await prisma.productComponent.findUnique({
    where: {
      id_product_id_component: { id_product, id_component },
    },
    include: { product: true, component: { include: { supplier: true } } },
  });

  if (!productComponent) {
    throw {
      status: 404,
      message: "Product Component not found",
    };
  }

  return productComponent;
};

// CREATE PRODUCT COMPONENT
const createProductComponent = async (data) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id_product: data.id_product },
    });

    if (!product) {
      throw {
        status: 404,
        message: "Product not found",
      };
    }

    return await prisma.productComponent.create({
      data: {
        id_product: data.id_product,
        id_component: data.id_component,
        quantity: data.quantity,
      },
      include: { product: true, component: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "This product component already exists",
      };
    }
    throw error;
  }
};

// UPDATE PRODUCT COMPONENT
const updateProductComponent = async (id_product, id_component, quantity) => {
  const productComponent = await prisma.productComponent.findUnique({
    where: {
      id_product_id_component: { id_product, id_component },
    },
  });

  if (!productComponent) {
    throw {
      status: 404,
      message: "Product Component not found",
    };
  }

  return await prisma.productComponent.update({
    where: {
      id_product_id_component: { id_product, id_component },
    },
    data: { quantity },
    include: { product: true, component: true },
  });
};

const deleteProductComponent = async (id_product, id_component) => {
  const productComponent = await prisma.productComponent.findUnique({
    where: {
      id_product_id_component: { id_product, id_component },
    },
  });

  if (!productComponent) {
    throw {
      status: 404,
      message: "Product Component not found",
    };
  }

  return await prisma.productComponent.delete({
    where: {
      id_product_id_component: { id_product, id_component },
    },
    include: { component: true },
  });
};

module.exports = {
  getAllProductComponents,
  getProductComponentById,
  createProductComponent,
  updateProductComponent,
  deleteProductComponent,
};
