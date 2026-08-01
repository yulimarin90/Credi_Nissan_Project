const ExcelJS = require("exceljs");

const importadorRepository = require("../repository/repository");

class ImportadorService {

    async importarExcel(rutaArchivo) {

        console.log("==================================");
        console.log("Iniciando importación...");
        console.log("Archivo:", rutaArchivo);

        const workbook = new ExcelJS.stream.xlsx.WorkbookReader(rutaArchivo);

        let encabezados = [];
        let total = 0;
        let insertados = 0;
        let existentes = 0;

        for await (const worksheet of workbook) {

            console.log("Leyendo hoja:", worksheet.name);

            for await (const row of worksheet) {

                // Primera fila = encabezados
                if (row.number === 1) {

                    encabezados = row.values.map(valor =>
                        valor ? valor.toString().trim() : ""
                    );

                    console.log("Encabezados cargados.");
                    continue;
                }

                const fila = {};

                row.values.forEach((valor, indice) => {

                    if (indice === 0) return;

                    fila[encabezados[indice]] = valor;

                });

                total++;

                const id_credit = fila["id_credit_form"];

                if (!id_credit) {
                    continue;
                }

                const existe = await importadorRepository.buscarPorId(id_credit);

                if (!existe) {

                    await importadorRepository.insertar(fila);

                    insertados++;

                    if (insertados <= 10) {
                        console.log(`Insertado: ${id_credit}`);
                    }

                } else {

                    await importadorRepository.actualizar(fila);

                    existentes++;

                    if (existentes <= 10) {
                        console.log(`Ya existe: ${id_credit}`);
                    }

                }

                if (total % 1000 === 0) {
                    console.log(`${total} filas procesadas...`);
                }

            }

        }

        console.log("==================================");
        console.log("Importación finalizada");
        console.log("Total procesados:", total);
        console.log("Insertados:", insertados);
        console.log("Existentes:", existentes);

        return {
            total,
            insertados,
            actualizados: existentes
        };

    }

}

module.exports = new ImportadorService();