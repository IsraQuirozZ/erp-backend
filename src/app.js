const express = require("express");
const provinciaRoutes = require("./routes/provincia.routes");
const direccionRoutes = require("./routes/direccion.routes");

const app = express();

app.use(express.json());

app.use("/api/provincias", provinciaRoutes);
app.use("/api/direcciones", direccionRoutes);

app.get("/", (req, res) => {
  res.send("API ERP funcionando");
});

module.exports = app;
