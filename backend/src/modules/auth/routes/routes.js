const express = require("express");

const router = express.Router();

const authController = require("../controller/controller");
const authmiddleware = require("../../../middlewares/authmiddleware");
const rolemiddleware = require("../../../middlewares/rolemiddleware");


router.post("/login", authController.login);

router.post("/usuarios", authController.crearUsuario);

router.get("/usuarios", authmiddleware, rolemiddleware(["Coordinador operativo"]), authController.listarUsuarios);

router.patch(
    "/usuarios/:id/activar",
    authController.activarUsuario
);

router.patch(
    "/usuarios/:id/confirmar",
    authController.confirmarCorreo
);

router.patch(
    "/usuarios/:id/desbloquear", 
    authController.desbloquearUsuario
);

router.patch(
"/cambiar-password",
authController.cambiarPassword
);

module.exports = router;