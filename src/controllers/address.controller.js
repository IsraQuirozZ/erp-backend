const addressService = require("../services/address.service");

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAllAddresses();
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

const getAddress = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const address = await addressService.getAddressById(id);
    res.json(address);
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(req.body);
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const address = await addressService.updateAddress(id, req.body);
    res.json(address);
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const address = await addressService.deleteAddress(id);
    res.json({
      message: `Address --${address.street}, ${address.number}-- with id ${address.id_address} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
};
