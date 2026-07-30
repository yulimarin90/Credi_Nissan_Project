const express = require("express");
const multer = require("multer");

const importadorController = require("../controller/controller");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/importar",
    upload.single("archivo"),
    importadorController.importar
);

module.exports = router;