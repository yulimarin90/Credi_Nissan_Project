const service = require("../service/service");

class SeguimientoController {
    async listar(req, res) {
        try {
            const seguimientos = await service.listarPorAsesor(req.usuario.id);
            return res.json(seguimientos);
        } catch (error) {
            return res.status(500).json({ mensaje: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const resultado = await service.actualizar(
                Number(req.params.id),
                req.usuario.id,
                req.body
            );
            return res.json(resultado);
        } catch (error) {
            return res.status(400).json({ mensaje: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const resultado = await service.desactivar(
                Number(req.params.id),
                req.usuario.id
            );
            return res.json(resultado);
        } catch (error) {
            return res.status(400).json({ mensaje: error.message });
        }
    }
}

module.exports = new SeguimientoController();
