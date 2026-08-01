const service = require("../service/service");

class IndicadoresController {
    async obtener(req, res) {
        try {
            const indicadores = await service.obtenerPorAsesor(req.usuario.id);
            return res.json(indicadores);
        } catch (error) {
            return res.status(500).json({ mensaje: error.message });
        }
    }
}

module.exports = new IndicadoresController();
