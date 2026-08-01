const sql = require("mssql");
const { pool, poolConnect } = require("../../../config/Database");

class CoordinadorRepository {
    async listarUsuarios() {
        await poolConnect;
        const result = await pool.request().query(`
            SELECT u.id_usuario, u.nombre_completo, u.correo, u.id_regional, u.id_sala,
                   u.activo, u.correo_confirmado, u.bloqueado, u.intentos_fallidos,
                   r.nombre AS rol
            FROM Usuarios u
            INNER JOIN Roles r ON r.id_rol = u.id_rol
            ORDER BY u.fecha_creacion DESC
        `);
        return result.recordset;
    }

    async activarUsuario(id) {
        await poolConnect;
        const result = await pool.request().input("id", sql.Int, id).query(`
            UPDATE Usuarios SET activo = 1 WHERE id_usuario = @id;
            SELECT @@ROWCOUNT AS filas;
        `);
        return result.recordset[0].filas > 0;
    }

    async desbloquearUsuario(id) {
        await poolConnect;
        const result = await pool.request().input("id", sql.Int, id).query(`
            UPDATE Usuarios SET bloqueado = 0, intentos_fallidos = 0 WHERE id_usuario = @id;
            SELECT @@ROWCOUNT AS filas;
        `);
        return result.recordset[0].filas > 0;
    }

    async eliminarUsuario(id) {
        await poolConnect;
        const result = await pool.request().input("id", sql.Int, id).query(`
            DELETE FROM Usuarios WHERE id_usuario = @id;
        `);
        return result.rowsAffected[0] > 0;
    }

    async obtenerOperacion() {
        await poolConnect;
        const result = await pool.request().query(`
            SELECT
                COUNT(DISTINCT s.id_seguimiento) AS total,
                SUM(CASE WHEN sc.estatus_general = 'Custodio' THEN 1 ELSE 0 END) AS custodio,
                SUM(CASE WHEN sc.estatus_general = 'En estudio' OR sc.estatus_general IS NULL THEN 1 ELSE 0 END) AS pendientes
            FROM Seguimientos s
            INNER JOIN SolicitudesCredito sc ON sc.id_credit = s.id_credit_form
            WHERE s.activo = 1;

            SELECT u.id_regional, u.id_sala, COUNT(DISTINCT s.id_seguimiento) AS total,
                   SUM(CASE WHEN sc.estatus_general = 'Custodio' THEN 1 ELSE 0 END) AS custodio,
                   SUM(CASE WHEN sc.estatus_general = 'En estudio' OR sc.estatus_general IS NULL THEN 1 ELSE 0 END) AS pendientes
            FROM Usuarios u
            LEFT JOIN Seguimientos s ON s.id_asesor = u.id_usuario AND s.activo = 1
            LEFT JOIN SolicitudesCredito sc ON sc.id_credit = s.id_credit_form
            GROUP BY u.id_regional, u.id_sala
            ORDER BY u.id_regional, u.id_sala;
        `);
        return { resumen: result.recordsets[0][0], distribucion: result.recordsets[1] };
    }

    async listarClientes(estatus) {
        await poolConnect;
        const request = pool.request().input("estatus", sql.VarChar(100), estatus);
        const result = await request.query(`
            SELECT s.id_seguimiento, s.id_credit_form, s.fecha_escaneo,
                   sc.num_identificacion, sc.primer_nombre, sc.segundo_nombre,
                   sc.primer_apellido, sc.segundo_apellido, sc.estatus_general,
                   sc.vendedor, sc.sala, sc.concesionario, sc.ciudad,
                   sc.marca, sc.tipo_vehiculo, sc.familia, sc.version_vehiculo,
                   sc.plan_financiero, sc.cuota_normal,
                   s.id_asesor, u.nombre_completo AS asesor, u.id_regional, u.id_sala,
                   s.activo, s.fecha_escaneo, d.nombre_archivo, d.fecha_carga
            FROM Seguimientos s
            INNER JOIN SolicitudesCredito sc ON sc.id_credit = s.id_credit_form
            INNER JOIN Usuarios u ON u.id_usuario = s.id_asesor
            OUTER APPLY (SELECT TOP 1 nombre_archivo FROM DocumentosPDF WHERE id_seguimiento = s.id_seguimiento ORDER BY fecha_carga DESC) d
            WHERE s.activo = 1
                            AND (
                                        @estatus = 'Todos'
                                        OR (@estatus = 'Custodio' AND sc.estatus_general = 'Custodio')
                                        OR (@estatus = 'Pendiente' AND (sc.estatus_general = 'En estudio' OR sc.estatus_general IS NULL))
                                    )
            ORDER BY s.fecha_escaneo DESC;
        `);
        return result.recordset;
    }
}

module.exports = new CoordinadorRepository();
