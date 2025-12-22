const provinceService = require("../services/province.service");

// Get All Provinces
const getProvinces = async (req, res, next) => {
  try {
    const provinces = await provinceService.getAllProvinces();
    res.json(provinces);
  } catch (error) {
    next(error);
  }
};

// Get Province By ID
const getProvince = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const province = await provinceService.getProvinceById(id);
    res.json(province);
  } catch (error) {
    next(error);
  }
};

// Create Province
const createProvince = async (req, res, next) => {
  try {
    const province = await provinceService.createProvince(req.body);
    res.status(201).json(province);
  } catch (error) {
    next(error);
  }
};

// Update Province
const updateProvince = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const province = await provinceService.updateProvince(id, req.body);
    res.json(province);
  } catch (error) {
    next(error);
  }
};

// Delete Province
const deleteProvince = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const province = await provinceService.deleteProvince(id);

    res.json({
      message: `Province --${province.name}-- with id ${province.id_province} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProvinces,
  getProvince,
  createProvince,
  updateProvince,
  deleteProvince,
};
