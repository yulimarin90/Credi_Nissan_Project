const sql = require("mssql");
const { pool, poolConnect } = require("../../../config/Database");

class AuthRepository {

    async buscarPorCorreo(correo) {

        await poolConnect;

        const result = await pool.request()
            .input("correo", sql.VarChar, correo)
            .query(`
                SELECT
                    u.*,
                    r.nombre AS rol
                FROM Usuarios u
                INNER JOIN Roles r
                    ON u.id_rol = r.id_rol
                WHERE correo=@correo
            `);

        return result.recordset[0];
    }

    async crearUsuario(usuario) {

        await poolConnect;

        await pool.request()
            .input("nombre", sql.VarChar, usuario.nombre_completo)
            .input("correo", sql.VarChar, usuario.correo)
            .input("password", sql.VarChar, usuario.password_hash)
            .input("idRol", sql.Int, usuario.id_rol)
            .input("idRegional", sql.Int, usuario.id_regional)
            .input("idSala", sql.Int, usuario.id_sala)
            .input("primerInicio", sql.Bit, usuario.primer_inicio)

            .query(`
                INSERT INTO Usuarios
                (
                    nombre_completo,
                    correo,
                    password_hash,
                    id_rol,
                    id_regional,
                    id_sala,
                    primer_inicio,
                    activo,
                    correo_confirmado,
                    bloqueado,
                    intentos_fallidos,
                    fecha_creacion
                )

                VALUES
                (
                    @nombre,
                    @correo,
                    @password,
                    @idRol,
                    @idRegional,
                    @idSala,
                    @primerInicio,
                    0,
                    0,
                    0,
                    0,
                    GETDATE()
                )
            `);

    }

    async actualizarUltimoAcceso(idUsuario) {

        await poolConnect;

        await pool.request()
            .input("id", sql.Int, idUsuario)
            .query(`
                UPDATE Usuarios
                SET
                    ultimo_acceso = GETDATE(),
                    intentos_fallidos = 0
                WHERE id_usuario=@id
            `);

    }

    async incrementarIntentos(idUsuario) {

        await poolConnect;

        await pool.request()
            .input("id", sql.Int, idUsuario)
            .query(`
                UPDATE Usuarios
                SET intentos_fallidos = intentos_fallidos + 1
                WHERE id_usuario=@id
            `);

    }

    async bloquearUsuario(idUsuario) {

        await poolConnect;

        await pool.request()
            .input("id", sql.Int, idUsuario)
            .query(`
                UPDATE Usuarios
                SET bloqueado = 1
                WHERE id_usuario=@id
            `);

    }

    async activarUsuario(idUsuario) {

        await poolConnect;

        await pool.request()
            .input("id", sql.Int, idUsuario)
            .query(`
                UPDATE Usuarios
                SET activo = 1
                WHERE id_usuario=@id
            `);

    }

    async confirmarCorreo(idUsuario) {

        await poolConnect;

        await pool.request()
            .input("id", sql.Int, idUsuario)
            .query(`
                UPDATE Usuarios
                SET correo_confirmado = 1
                WHERE id_usuario=@id
            `);

    }

    async desbloquearUsuario(idUsuario) {

        await poolConnect;

        await pool.request()
            .input("id", sql.Int, idUsuario)
            .query(`
                UPDATE Usuarios
                SET
                    bloqueado = 0,
                    intentos_fallidos = 0
                WHERE id_usuario=@id
            `);

    }

    async listarUsuarios() {

        await poolConnect;

        const result = await pool.request().query(`
            SELECT
                u.id_usuario,
                u.nombre_completo,
                u.correo,
                u.activo,
                u.correo_confirmado,
                u.bloqueado,
                r.nombre AS rol
            FROM Usuarios u
            INNER JOIN Roles r
                ON r.id_rol=u.id_rol
        `);

        return result.recordset;

    }

    async buscarPorId(id) {

        await poolConnect;

        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT *
                FROM Usuarios
                WHERE id_usuario=@id
            `);

        return result.recordset[0];

    }

    async actualizarPassword(idUsuario, passwordHash) {

    await poolConnect;

    await pool.request()

        .input("id", sql.Int, idUsuario)

        .input(
            "password",
            sql.VarChar,
            passwordHash
        )

        .query(`
            UPDATE Usuarios
            SET
                password_hash = @password,
                primer_inicio = 0
            WHERE id_usuario = @id
        `);

}

}


module.exports = new AuthRepository();