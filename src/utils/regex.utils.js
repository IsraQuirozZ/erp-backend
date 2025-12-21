const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const onlyNumbersRegex = /^[0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9}$/;

module.exports = {
  onlyLettersRegex,
  onlyNumbersRegex,
  emailRegex,
  phoneRegex,
};
