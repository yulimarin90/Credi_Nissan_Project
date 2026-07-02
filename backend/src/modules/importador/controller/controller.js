const importadorService = require("../service/importador.service");

class ImportadorController {

    async importar(req, res) {

        try {

            if (!req.file) {
                return res.status(400).json({
                    mensaje: "Debe seleccionar un archivo Excel."
                });
            }

            await importadorService.importarExcel(req.file.path);

            return res.status(200).json({
                mensaje: "Importación finalizada correctamente."
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