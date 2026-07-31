const express = require("express");

const router = express.Router();

const controller = require("../controller/controller");

const multer = require("multer");
const auth = require("../../../middlewares/authmiddleware");


const upload = multer({
    dest:"uploads/"
});


router.post(
"/scan", auth,
upload.single("archivo"),
controller.escanear
);


module.exports = router;