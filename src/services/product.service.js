const prisma = require("../config/prisma");

const getAllProducts = async () => {
  return await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: { supplierProduct: true },
  });
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id_product: id },
    include: { supplierProduct: true },
  });

  if (!product) {
    throw {
      status: 404,
      message: "Product not found",
    };
  }

  return product;
};

const createProduct = async (data) => {
  try {
    const supplierProduct = await prisma.supplierProduct.findUnique({
      where: { id_supplier_product: data.id_supplier_product },
    });

    if (!supplierProduct) {
      throw {
        status: 400,
        message: "The Supplier Product provided does not exist",
      };
    }

    return await prisma.product.create({
      data,
      include: { supplierProduct: true },
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
    include: { supplierProduct: true },
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

  return await prisma.product.update({
    where: { id_product: id },
    include: { supplierProduct: true },
    data: { active: false },
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
