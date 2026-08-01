const express = require("express");
const cors = require("cors");
require("dotenv").config();

const importadorRoutes = require("./modules/importador/routes/routes");
const authRoutes = require("./modules/auth/routes/routes");
const pdfRoutes = require("./modules/pdf/routes/routes");
const seguimientoRoutes = require("./modules/seguimiento/routes/routes");
const indicadoresRoutes = require("./modules/indicadores/routes/routes");
const coordinadorRoutes = require("./modules/coordinador/routes/routes");
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/importador", importadorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/seguimientos", seguimientoRoutes);
app.use("/api/indicadores", indicadoresRoutes);
app.use("/api/coordinador", coordinadorRoutes);
// Prueba del servidor
app.get("/", (_req, res) => {
    res.json({
        mensaje: "API Credi Nissan funcionando correctamente"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});