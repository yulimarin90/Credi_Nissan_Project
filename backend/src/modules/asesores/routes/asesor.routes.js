const express = require('express');

const router = express.Router();

const asesorController = require('../controller/asesor.controller');

router.get('/', asesorController.obtenerAsesores);

module.exports = router;