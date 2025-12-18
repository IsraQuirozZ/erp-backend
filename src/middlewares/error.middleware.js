const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Error con status definido (nuestros errores controlados)
  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  // Error de Prisma (por si se nos cuela alguno)
  if (err.code === "P2002") {
    return res.status(400).json({
      error: "Registro duplicado",
    });
  }

  // Error genérico
  res.status(500).json({
    error: "Error interno del servidor",
  });
};

module.exports = errorMiddleware;
