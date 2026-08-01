const service = require("../service/service");

class CoordinadorController {
    async ejecutar(req, res, fn) {
        try { return res.json(await fn()); }
        catch (error) { return res.status(400).json({ mensaje: error.message }); }
    }
    usuarios(req, res) { return this.ejecutar(req, res, () => service.listarUsuarios()); }
    operacion(req, res) { return this.ejecutar(req, res, () => service.obtenerOperacion()); }
    clientes(req, res) { return this.ejecutar(req, res, () => service.listarClientes(req.query.estatus || "Pendiente")); }
    activar(req, res) { return this.ejecutar(req, res, () => service.activar(Number(req.params.id))); }
    desbloquear(req, res) { return this.ejecutar(req, res, () => service.desbloquear(Number(req.params.id))); }
    eliminar(req, res) { return this.ejecutar(req, res, () => service.eliminar(Number(req.params.id))); }
}
module.exports = new CoordinadorController();
