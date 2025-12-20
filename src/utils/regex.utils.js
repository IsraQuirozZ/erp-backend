const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const onlyNumbersRegex = /^[0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefonoRegex = /^[0-9]{9}$/;

module.exports = {
  onlyLettersRegex,
  onlyNumbersRegex,
  emailRegex,
  telefonoRegex,
};
