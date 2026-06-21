const asesorService = require('../service/asesor.service');

const obtenerAsesores = async (req, res) => {
    try {
        const asesores = await asesorService.obtenerTodos();

        res.status(200).json({
            ok: true,
            data: asesores
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: error.message
        });

    }
};

module.exports = {
    obtenerAsesores
};