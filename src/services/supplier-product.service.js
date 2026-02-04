const prisma = require("../config/prisma");

const getAllSupplierProducts = async () => {
  return await prisma.component.findMany({
    where: { active: true },
    orderBy: {
      // name: "asc",
      id_component: "asc",
    },
    include: { supplier: true },
  });
};

const getComponentById = async (id) => {
  const component = await prisma.component.findUnique({
    where: { id_component: id },
    include: { supplier: true },
  });

  if (!component) {
    throw {
      status: 404,
      message: "Supplier product not found",
    };
  }

  return component;
};

const getComponentsBySupplierId = async (
  id,
  { skip, take, where, orderBy },
) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id_supplier: id },
  });

  if (!supplier) {
    throw {
      status: 400,
      message: "Supplier not found",
    };
  }

  return await prisma.component.findMany({
    where: { ...where, id_supplier: id },
    skip,
    take,
    orderBy: orderBy || { name: "asc" },
    include: { supplier: true },
  });
};

const countComponents = async (where) => {
  return await prisma.component.count({
    where: where || {},
  });
};

const createSupplierProduct = async (data) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id_supplier: data.id_supplier },
    });

    if (!supplier) {
      throw {
        status: 400,
        message: "The supplier provided does not exist",
      };
    }

    return await prisma.component.create({
      data,
      include: { supplier: true },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "This supplier already has a product with this name",
      };
    }

    throw error;
  }
};

const updateComponentById = async (id, data) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id_component: id },
    });

    if (!component) {
      throw {
        status: 404,
        message: "Supplier product not found",
      };
    }

    if (data.id_supplier !== undefined) {
      throw {
        status: 400,
        message: "The Supplier ID can not be updated",
      };
    }

    const updatedComponent = await prisma.component.update({
      where: { id_component: id },
      include: { supplier: true },
      data: data,
    });

    const supplier = await prisma.supplier.findUnique({
      where: { id_supplier: updatedComponent.id_supplier },
    });

    if (supplier.active !== true) {
      throw {
        status: 400,
        message:
          "The product can not be activated if {active : false} in supplier",
      };
    }

    return updatedComponent;
  } catch (error) {
    if (error.code === "P2002") {
      throw {
        status: 400,
        message: "This supplier already has a product with this name",
      };
    }
    throw error;
  }
};

// Logical deletion: the record is marked as inactive instead of being physically removed
// Can not be deleted if it has associated records (orders,etc)
// We use toggle active to false
const deleteComponentById = async (id) => {
  const component = await prisma.component.findUnique({
    where: { id_component: id },
    include: { supplier: true },
  });

  if (!component) {
    throw {
      status: 404,
      message: "Supplier Product not found",
    };
  }

  if (!component.active) {
    if (component.supplier.active !== true) {
      throw {
        status: 409,
        message:
          "Cannot change product status if the associated supplier is inactive.",
      };
    }
    return await prisma.component.update({
      where: { id_component: id },
      data: { active: true },
    });
  }

  return await prisma.component.update({
    where: { id_component: id },
    data: { active: false },
  });
};

module.exports = {
  getAllSupplierProducts,
  getComponentById,
  getComponentsBySupplierId,
  countComponents,
  createSupplierProduct,
  updateComponentById,
  deleteComponentById,
};
