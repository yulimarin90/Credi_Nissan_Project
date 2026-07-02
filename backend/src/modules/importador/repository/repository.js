const { pool, poolConnect } = require("../../../config/Database");

class ImportadorRepository {

    async buscarPorId(id_credit) {

        await poolConnect;

        const result = await pool
            .request()
            .input("id_credit", id_credit)
            .query(`
                SELECT id_credit
                FROM SolicitudesCredito
                WHERE id_credit = @id_credit
            `);

        return result.recordset[0];
    }

}

module.exports = new ImportadorRepository();