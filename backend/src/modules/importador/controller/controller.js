const importadorService = require("../service/service");

class ImportadorController {

    async importar(req, res) {

        try {

            if (!req.file) {
                return res.status(400).json({
                    mensaje: "Debe seleccionar un archivo Excel."
                });
            }

            const resultado = await importadorService.importarExcel(req.file.path);

            return res.status(200).json({
                mensaje: `Importación finalizada: ${resultado.insertados} nuevos y ${resultado.actualizados} actualizados.`,
                ...resultado
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                mensaje: "Error al importar el archivo."
            });

        }

    }

}

module.exports = new ImportadorController();