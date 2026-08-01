const express = require("express");
const auth = require("../../../middlewares/authmiddleware");
const role = require("../../../middlewares/rolemiddleware");
const controller = require("../controller/controller");

const router = express.Router();
router.use(auth, role(["Coordinador operativo", "Coordinador Operativo"]));
router.get("/usuarios", controller.usuarios.bind(controller));
router.patch("/usuarios/:id/activar", controller.activar.bind(controller));
router.patch("/usuarios/:id/desbloquear", controller.desbloquear.bind(controller));
router.delete("/usuarios/:id", controller.eliminar.bind(controller));
router.get("/clientes", controller.clientes.bind(controller));
router.get("/operacion", controller.operacion.bind(controller));
module.exports = router;
