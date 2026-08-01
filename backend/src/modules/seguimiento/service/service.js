const repository = require("../repository/repository");

class SeguimientoService {
    async listarPorAsesor(idAsesor) {
        return repository.listarPorAsesor(idAsesor);
    }

    async actualizar(idSeguimiento, idAsesor, datos) {
        const estatusGeneral = String(datos.estatus_general || "").trim();

        if (estatusGeneral !== "Custodio") {
            throw new Error("El asesor solo puede enviar el seguimiento a Custodio.");
        }

        const actualizado = await repository.actualizar({
            idSeguimiento,
            idAsesor,
            estatusGeneral
        });

        if (!actualizado) {
            throw new Error("El seguimiento no existe o no pertenece al asesor.");
        }

        return { mensaje: "Seguimiento actualizado correctamente." };
    }

    async desactivar(idSeguimiento, idAsesor) {
        const desactivado = await repository.desactivar(idSeguimiento, idAsesor);

        if (!desactivado) {
            throw new Error("El seguimiento no existe o no pertenece al asesor.");
        }

        return { mensaje: "Seguimiento y documento eliminados correctamente." };
    }
}

module.exports = new SeguimientoService();
