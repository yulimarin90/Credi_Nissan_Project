const repository = require("../repository/repository");

class IndicadoresService {
    async obtenerPorAsesor(idAsesor) {
        return repository.obtenerPorAsesor(idAsesor);
    }
}

module.exports = new IndicadoresService();
