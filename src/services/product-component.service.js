const prisma = require("../config/prisma");

// GET ALL PRODUCT COMPONENTS -> DEBUGGING PURPOSES
const getAllProductComponents = async () => {
  return await prisma.productComponent.findMany({
    include: { product: true },
  });
};

// CREATE PRODUCT COMPONENT
const createProductComponent = async (data) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id_product: data.id_product },
    });

    if (!product || product.active === false) {
      throw {
        status: 404,
        message: "Product not found or is not active",
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

module.exports = {
  getAllProductComponents,
  createProductComponent,
};
