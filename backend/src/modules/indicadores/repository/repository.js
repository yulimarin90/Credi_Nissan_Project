const sql = require("mssql");
const { pool, poolConnect } = require("../../../config/Database");

class IndicadoresRepository {
    async obtenerPorAsesor(idAsesor) {
        await poolConnect;

        const result = await pool.request()
            .input("asesor", sql.Int, idAsesor)
            .query(`
                DECLARE @sala INT;
                SELECT @sala = id_sala FROM Usuarios WHERE id_usuario = @asesor;

                SELECT
                    'personal' AS tipo,
                    COUNT(s.id_seguimiento) AS total,
                    SUM(CASE WHEN sc.estatus_general = 'Custodio' THEN 1 ELSE 0 END) AS custodio,
                    SUM(CASE WHEN sc.estatus_general = 'En estudio' OR sc.estatus_general IS NULL THEN 1 ELSE 0 END) AS en_estudio
                FROM Seguimientos s
                INNER JOIN SolicitudesCredito sc ON sc.id_credit = s.id_credit_form
                WHERE s.id_asesor = @asesor
                  AND s.activo = 1;

                SELECT
                    u.id_usuario,
                    u.nombre_completo,
                    u.correo,
                    COUNT(s.id_seguimiento) AS total,
                    SUM(CASE WHEN sc.estatus_general = 'Custodio' THEN 1 ELSE 0 END) AS custodio,
                    SUM(CASE WHEN sc.estatus_general = 'En estudio' OR sc.estatus_general IS NULL THEN 1 ELSE 0 END) AS en_estudio
                FROM Usuarios u
                INNER JOIN Roles r ON r.id_rol = u.id_rol
                LEFT JOIN Seguimientos s ON s.id_asesor = u.id_usuario AND s.activo = 1
                LEFT JOIN SolicitudesCredito sc ON sc.id_credit = s.id_credit_form
                WHERE r.nombre = 'Asesor'
                  AND @sala IS NOT NULL
                  AND u.id_sala = @sala
                GROUP BY u.id_usuario, u.nombre_completo, u.correo
                ORDER BY total DESC, u.nombre_completo;
            `);

        return {
            personal: result.recordsets[0][0] || { total: 0, custodio: 0, en_estudio: 0 },
            grupal: result.recordsets[1] || []
        };
    }
}

module.exports = new IndicadoresRepository();
