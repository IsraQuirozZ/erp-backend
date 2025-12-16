const express = require("express");
const provinciaRoutes = require("./routes/provincia.routes");

const app = express();

app.use(express.json());

app.use("/api/provincias", provinciaRoutes);

app.get("/", (req, res) => {
  res.send("API ERP funcionando");
});

module.exports = app;
