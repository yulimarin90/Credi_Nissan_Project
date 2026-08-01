const express = require("express");
const auth = require("../../../middlewares/authmiddleware");
const role = require("../../../middlewares/rolemiddleware");
const controller = require("../controller/controller");

const router = express.Router();
router.get("/", auth, role(["Asesor"]), controller.obtener);

module.exports = router;
