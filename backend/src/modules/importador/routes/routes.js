const express = require("express");
const multer = require("multer");

const importadorController = require("../controller/controller");
const auth = require("../../../middlewares/authmiddleware");
const role = require("../../../middlewares/rolemiddleware");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/importar",
    auth,
    role(["Coordinador operativo", "Coordinador Operativo"]),
    upload.single("archivo"),
    importadorController.importar
);

module.exports = router;