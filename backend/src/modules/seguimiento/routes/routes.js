const express = require("express");
const auth = require("../../../middlewares/authmiddleware");
const role = require("../../../middlewares/rolemiddleware");
const controller = require("../controller/controller");

const router = express.Router();
const soloAsesor = role(["Asesor"]);

router.use(auth, soloAsesor);
router.get("/", controller.listar);
router.patch("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
