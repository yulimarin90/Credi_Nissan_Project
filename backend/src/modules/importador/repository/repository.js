const { pool, poolConnect } = require("../../../config/Database");

function convertirFecha(fecha) {

    if (!fecha) return null;

    if (fecha instanceof Date) return fecha;

    if (typeof fecha === "string") {

        const partes = fecha.split("/");

        if (partes.length === 3) {

            const dia = Number(partes[0]);
            const mes = Number(partes[1]) - 1;
            const anio = Number(partes[2]);

            return new Date(anio, mes, dia);
        }

    }

    return null;
}

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
    

      async insertar(datos) {

    await poolConnect;

    await pool.request()

        .input("id_credit", datos.id_credit_form)
        .input("num_identificacion", datos.num_identificacion)
        .input("primer_nombre", datos.primer_nombre)
        .input("segundo_nombre", datos.segundo_nombre)
        .input("primer_apellido", datos.primer_apellido)
        .input("segundo_apellido", datos.segundo_apellido)
        .input("vendedor", datos.vendedor)
        .input("sala", datos.sala)
        .input("concesionario", datos.concesionario)
        .input("ciudad", datos.ciudad)
        .input("region_sofasa", datos.region_sofasa)
        .input("estado", datos.estado)
        .input("estatus_general", datos.estatus_general)

        .input("fecha_radicacion", convertirFecha(datos.fecha_creacion_solicitud))
        .input("fecha_aprobacion", convertirFecha(datos.fecha_primera_aprobacion))
        .input("fecha_desembolso", convertirFecha(datos.fecha_desembolso))
        // Fecha en la que se sincronizó con nuestro sistema
        .input("fecha_sincronizacion", new Date())


.input("marca", datos.tipo_de_mercado)
.input("tipo_vehiculo", datos.estado)
.input("familia", datos.familia_vehiculo)
.input("version_vehiculo", datos.version_vehiculo)
.input("servicio", datos.tipo_vehiculo)

.input("plan_financiero", datos.Nombre_plan_financiero)
.input("plazo_credito", datos.plazo)
.input("cuota_normal", datos.valor_cuota)


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
                ciudad,
                region_sofasa,
                estado,
                estatus_general,
                fecha_radicacion,
                fecha_aprobacion,
                fecha_desembolso,
                fecha_sincronizacion,
                marca,
                tipo_vehiculo,
                familia,
                version_vehiculo,
                servicio,
                plan_financiero,
                plazo_credito,
                cuota_normal
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
                @ciudad,
                @region_sofasa,
                @estado,
                @estatus_general,
                @fecha_radicacion,
                @fecha_aprobacion,
                @fecha_desembolso,
                @fecha_sincronizacion,
                @marca,
                @tipo_vehiculo,
                @familia,
                @version_vehiculo,
                @servicio,
                @plan_financiero,
                @plazo_credito,
                @cuota_normal
            )
        `);

}

    async actualizar(datos) {

        await poolConnect;

        await pool.request()
            .input("id_credit", datos.id_credit_form)
            .input("num_identificacion", datos.num_identificacion)
            .input("primer_nombre", datos.primer_nombre)
            .input("segundo_nombre", datos.segundo_nombre)
            .input("primer_apellido", datos.primer_apellido)
            .input("segundo_apellido", datos.segundo_apellido)
            .input("vendedor", datos.vendedor)
            .input("sala", datos.sala)
            .input("concesionario", datos.concesionario)
            .input("ciudad", datos.ciudad)
            .input("region_sofasa", datos.region_sofasa)
            .input("estado", datos.estado)
            .input("estatus_general", datos.estatus_general)
            .input("fecha_radicacion", convertirFecha(datos.fecha_creacion_solicitud))
            .input("fecha_aprobacion", convertirFecha(datos.fecha_primera_aprobacion))
            .input("fecha_desembolso", convertirFecha(datos.fecha_desembolso))
            .input("fecha_sincronizacion", new Date())
            .input("marca", datos.tipo_de_mercado)
            .input("tipo_vehiculo", datos.estado)
            .input("familia", datos.familia_vehiculo)
            .input("version_vehiculo", datos.version_vehiculo)
            .input("servicio", datos.tipo_vehiculo)
            .input("plan_financiero", datos.Nombre_plan_financiero)
            .input("plazo_credito", datos.plazo)
            .input("cuota_normal", datos.valor_cuota)
            .query(`
                UPDATE SolicitudesCredito
                SET
                    num_identificacion = @num_identificacion,
                    primer_nombre = @primer_nombre,
                    segundo_nombre = @segundo_nombre,
                    primer_apellido = @primer_apellido,
                    segundo_apellido = @segundo_apellido,
                    vendedor = @vendedor,
                    sala = @sala,
                    concesionario = @concesionario,
                    ciudad = @ciudad,
                    region_sofasa = @region_sofasa,
                    estado = @estado,
                    estatus_general = COALESCE(@estatus_general, estatus_general),
                    fecha_radicacion = @fecha_radicacion,
                    fecha_aprobacion = @fecha_aprobacion,
                    fecha_desembolso = @fecha_desembolso,
                    fecha_sincronizacion = @fecha_sincronizacion,
                    marca = @marca,
                    tipo_vehiculo = @tipo_vehiculo,
                    familia = @familia,
                    version_vehiculo = @version_vehiculo,
                    servicio = @servicio,
                    plan_financiero = @plan_financiero,
                    plazo_credito = @plazo_credito,
                    cuota_normal = @cuota_normal
                WHERE id_credit = @id_credit
            `);

    }
}
module.exports = new ImportadorRepository();