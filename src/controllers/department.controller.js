const departmentService = require("../services/department.service");

const getDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

const getDepartment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const department = await departmentService.getDepartmentById(id);
    res.json(department);
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const department = await departmentService.updateDepartmentById(
      id,
      req.body
    );
    res.json(department);
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const department = await departmentService.deleteDepartmentById(id);
    res.json({
      message: `Department --${department.name}-- with id ${department.id_department} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
