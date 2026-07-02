const xlsx = require("xlsx");

const excelMapper = require("../utils/excelMapper");
const importadorRepository = require("../repository/importador.repository");

class ImportadorService {

    async importarExcel(rutaArchivo) {

        console.log("Leyendo archivo...");

        const workbook = xlsx.readFile(rutaArchivo);

        const hoja = workbook.Sheets[workbook.SheetNames[0]];

        const filas = xlsx.utils.sheet_to_json(hoja);

        console.log(`Se encontraron ${filas.length} registros.`);

        for (const fila of filas) {

            const id_credit = fila[excelMapper.id_credit];

            const existe = await importadorRepository.buscarPorId(id_credit);

            if (existe) {

                console.log(`El crédito ${id_credit} ya existe.`);

            } else {

                console.log(`El crédito ${id_credit} es nuevo.`);

            }

        }

    }

}

module.exports = new ImportadorService();