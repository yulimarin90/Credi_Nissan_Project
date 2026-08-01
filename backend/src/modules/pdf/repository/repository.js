const sql = require("mssql");

const {
    pool,
    poolConnect
} = require("../../../config/Database");


class PdfRepository {


    async buscarSolicitud(id_credit) {

        await poolConnect;


        const result =
        await pool.request()

        .input(
            "id",
            sql.Int,
            id_credit
        )

        .query(`

            SELECT *

            FROM SolicitudesCredito

            WHERE id_credit = @id

        `);


        return result.recordset[0];

    }



    async inicializarEstatusGeneral(id_credit) {

        await poolConnect;

        await pool.request()

        .input(
            "id",
            sql.Int,
            id_credit
        )

        .query(`

            UPDATE SolicitudesCredito
            SET estatus_general = 'En estudio'
            WHERE id_credit = @id
            AND estatus_general IS NULL

        `);

    }

    async buscarSeguimiento(id_credit) {

        await poolConnect;


        const result =
        await pool.request()

        .input(
            "id",
            sql.Int,
            id_credit
        )

        .query(`

            SELECT *

            FROM Seguimientos

            WHERE id_credit_form = @id

        `);


        return result.recordset[0];

    }



   async crearSeguimiento(data) {

    await poolConnect;


    const result =
    await pool.request()

    .input(
        "credito",
        sql.Int,
        data.id_credit_form
    )

    .input(
        "asesor",
        sql.Int,
        data.id_asesor
    )

    .query(`

        INSERT INTO Seguimientos
        (
            id_credit_form,
            id_asesor,
            fecha_escaneo,
            activo
        )

        OUTPUT INSERTED.*

        VALUES
        (
            @credito,
            @asesor,
            GETDATE(),
            1
        )

    `);


    return {
        mensaje:"Seguimiento creado correctamente",
        seguimiento: result.recordset[0]
    };

}


    async guardarDocumento(data){

        await poolConnect;


        await pool.request()

        .input(
            "seguimiento",
            sql.Int,
            data.id_seguimiento
        )

        .input(
            "nombre",
            sql.VarChar,
            data.nombre_archivo
        )

        .input(
            "ruta",
            sql.VarChar,
            data.ruta_archivo
        )

        .query(`

            INSERT INTO DocumentosPDF
            (
                id_seguimiento,
                nombre_archivo,
                ruta_archivo,
                fecha_carga
            )

            VALUES
            (
                @seguimiento,
                @nombre,
                @ruta,
                GETDATE()
            )

        `
        
    );

        }
async crearSolicitud(datos){

    await poolConnect;

    const result = await pool.request()

    .input(
        "id_credit",
        sql.Int,
        datos.id_credit
    )

    .input(
        "num_identificacion",
        sql.VarChar,
        datos.num_identificacion
    )

    .input(
        "primer_nombre",
        sql.VarChar,
        datos.primer_nombre
    )

    .input(
        "segundo_nombre",
        sql.VarChar,
        datos.segundo_nombre
    )

    .input(
        "primer_apellido",
        sql.VarChar,
        datos.primer_apellido
    )

    .input(
        "segundo_apellido",
        sql.VarChar,
        datos.segundo_apellido
    )

    .input(
        "vendedor",
        sql.VarChar,
        datos.vendedor
    )

    .input(
        "sala",
        sql.VarChar,
        datos.sala
    )

    .input(
        "concesionario",
        sql.VarChar,
        datos.concesionario
    )

    .input(
        "marca",
        sql.VarChar,
        datos.marca
    )

    .input(
        "tipo_vehiculo",
        sql.VarChar,
        datos.tipo_vehiculo
    )

    .input(
        "familia",
        sql.VarChar,
        datos.familia
    )

    .input(
        "version_vehiculo",
        sql.VarChar,
        datos.version_vehiculo
    )

    .input(
        "servicio",
        sql.VarChar,
        datos.servicio
    )

    .input(
        "plan_financiero",
        sql.VarChar,
        datos.plan_financiero
    )

    .input(
        "cuota_normal",
        sql.Decimal(12,2),
        datos.cuota_normal
    )

    .input(
        "estatus_general",
        sql.VarChar(100),
        "En estudio"
    )


    .query(`

        INSERT INTO SolicitudesCredito
        (
            id_credit,
            num_identificacion,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            vendedor,
            sala,
            concesionario,
            marca,
            tipo_vehiculo,
            familia,
            version_vehiculo,
            servicio,
            plan_financiero,
            cuota_normal,
            estatus_general,
            fecha_sincronizacion
        )

        VALUES
        (
            @id_credit,
            @num_identificacion,
            @primer_nombre,
            @segundo_nombre,
            @primer_apellido,
            @segundo_apellido,
            @vendedor,
            @sala,
            @concesionario,
            @marca,
            @tipo_vehiculo,
            @familia,
            @version_vehiculo,
            @servicio,
            @plan_financiero,
            @cuota_normal,
            @estatus_general,
            GETDATE()
        )

    `);


    return {
        mensaje:"Solicitud creada"
    };

}


    }





module.exports = new PdfRepository();