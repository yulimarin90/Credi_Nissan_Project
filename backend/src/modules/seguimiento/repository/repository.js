const sql = require("mssql");
const { pool, poolConnect } = require("../../../config/Database");

class SeguimientoRepository {
    async listarPorAsesor(idAsesor) {
        await poolConnect;

        const result = await pool.request()
            .input("asesor", sql.Int, idAsesor)
            .query(`
                SELECT
                    s.id_seguimiento,
                    s.id_credit_form,
                    s.id_asesor,
                    s.fecha_escaneo,
                    s.activo,
                    sc.num_identificacion,
                    sc.primer_nombre,
                    sc.segundo_nombre,
                    sc.primer_apellido,
                    sc.segundo_apellido,
                    sc.vendedor,
                    sc.sala,
                    sc.concesionario,
                    sc.estatus_general,
                    sc.fecha_radicacion,
                    sc.fecha_aprobacion,
                    sc.fecha_desembolso,
                    d.nombre_archivo,
                    d.fecha_carga
                FROM Seguimientos s
                INNER JOIN SolicitudesCredito sc
                    ON sc.id_credit = s.id_credit_form
                OUTER APPLY (
                    SELECT TOP 1 nombre_archivo, fecha_carga
                    FROM DocumentosPDF
                    WHERE id_seguimiento = s.id_seguimiento
                    ORDER BY fecha_carga DESC
                ) d
                WHERE s.id_asesor = @asesor
                                    AND s.activo = 1
                ORDER BY s.fecha_escaneo DESC
            `);

        return result.recordset;
    }

    async actualizar(data) {
        await poolConnect;

        const result = await pool.request()
            .input("seguimiento", sql.Int, data.idSeguimiento)
            .input("asesor", sql.Int, data.idAsesor)
            .input("estatus", sql.VarChar(100), data.estatusGeneral)
            .query(`
                UPDATE sc
                SET
                    estatus_general = @estatus,
                    fecha_sincronizacion = GETDATE()
                FROM SolicitudesCredito sc
                INNER JOIN Seguimientos s
                    ON s.id_credit_form = sc.id_credit
                WHERE s.id_seguimiento = @seguimiento
                                    AND s.id_asesor = @asesor;

                SELECT @@ROWCOUNT AS filasAfectadas;
            `);

        return result.recordset[0].filasAfectadas > 0;
    }

    async desactivar(idSeguimiento, idAsesor) {
        await poolConnect;

        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction)
                .input("seguimiento", sql.Int, idSeguimiento)
                .input("asesor", sql.Int, idAsesor);

            await request.query(`
                DELETE d
                FROM DocumentosPDF d
                INNER JOIN Seguimientos s
                    ON s.id_seguimiento = d.id_seguimiento
                WHERE s.id_seguimiento = @seguimiento
                  AND s.id_asesor = @asesor;
            `);

            const result = await request.query(`
                DELETE FROM Seguimientos
                WHERE id_seguimiento = @seguimiento
                  AND id_asesor = @asesor;
            `);

            const eliminado = result.rowsAffected[0] > 0;

            if (!eliminado) {
                await transaction.rollback();
                return false;
            }

            await transaction.commit();
            return true;
        } catch (error) {
            try {
                await transaction.rollback();
            } catch (_rollbackError) {
                // La transacción puede ya estar cerrada o abortada.
            }
            throw error;
        }
    }
}

module.exports = new SeguimientoRepository();
