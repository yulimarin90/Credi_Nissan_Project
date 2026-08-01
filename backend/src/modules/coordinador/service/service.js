const repository = require("../repository/repository");

class CoordinadorService {
    listarUsuarios() { return repository.listarUsuarios(); }
    obtenerOperacion() { return repository.obtenerOperacion(); }
    listarClientes(estatus) { return repository.listarClientes(estatus); }
    async activar(id) { return this.cambiar(() => repository.activarUsuario(id), "Usuario activado correctamente."); }
    async desbloquear(id) { return this.cambiar(() => repository.desbloquearUsuario(id), "Usuario desbloqueado correctamente."); }
    async eliminar(id) { return this.cambiar(() => repository.eliminarUsuario(id), "Usuario eliminado correctamente."); }
    async cambiar(accion, mensaje) {
        if (!await accion()) throw new Error("El usuario no existe.");
        return { mensaje };
    }
}
module.exports = new CoordinadorService();
