const prisma = require("../config/prisma");

// GET ALL PRODUCTS WITH PAGINATION, FILTERING AND SORTING
const getAllProducts = async ({ skip, take, where, orderBy }) => {
  return await prisma.product.findMany({
    where: where || {},
    skip,
    take,
    orderBy: orderBy || { name: "asc" },
    include: { components: true },
  });
};

// COUNT PRODUCTS
const countProducts = async (where) => {
  return await prisma.product.count({
    where: where || {},
  });
};

// GET PRODUCT BY ID
const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id_product: id },
    include: { components: true },
  });

  if (!product) {
    throw {
      status: 404,
      message: "Product not found",
    };
  }

  return product;
};

// GET COMPONENTS BY PRODUCT ID
const getProductComponentsByProductId = async (
  productId,
  { skip, take, orderBy } = {},
) => {
  const product = await prisma.product.findUnique({
    where: { id_product: productId },
  });

  if (!product || product.active === false) {
    throw {
      status: 404,
      message: "Product not found or is not active",
    };
  }

  return await prisma.productComponent.findMany({
    where: { id_product: productId },
    include: { component: true },
    skip,
    take,
    orderBy: orderBy || {
      component: { name: "asc" },
    },
  });
};

// CREATE PRODUCT
const createProduct = async (data) => {
  try {
    return await prisma.product.create({
      data,
      include: { components: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message:
          "This product already exist (repeated name and supplier Product)",
      };
    }
    throw error;
  }
};

const updateProductById = async (id, data) => {
  const product = await prisma.product.findUnique({
    where: { id_product: id },
  });

  if (!product) {
    throw {
      status: 404,
      message: "Product not found",
    };
  }

  if (data.id_supplier_product !== undefined) {
    throw {
      status: 400,
      message: "The Supplier ID can not be updated",
    };
  }

  return await prisma.product.update({
    where: { id_product: id },
    include: { components: true },
    data,
  });
};

// Can not be deleted if it has associated records (orders,etc)
const deleteProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id_product: id },
  });

  if (!product) {
    throw {
      status: 404,
      message: "Product not found",
    };
  }

  if (!product.active) {
    return await prisma.product.update({
      where: { id_product: id },
      data: { active: true },
    });
  }

  return await prisma.product.update({
    where: { id_product: id },
    data: { active: false },
  });
};

module.exports = {
  getAllProducts,
  countProducts,
  getProductById,
  getProductComponentsByProductId,
  createProduct,
  updateProductById,
  deleteProductById,
};
