const pdfParse = require("pdf-parse");
const fs = require("fs");

const repository = require("../repository/repository");


class PdfService {


    async escanear(
        archivo,
        idAsesor
    ) {


        const buffer = fs.readFileSync(
            archivo.path
        );


        const data = await pdfParse(buffer);


        const texto = data.text;


        console.log("TEXTO PDF:");
        console.log(texto);



        const idCredito =
            this.extraerCredito(texto);



        if (!idCredito) {

            throw new Error(
                "No se encontró número de crédito"
            );

        }



        let solicitud =
            await repository.buscarSolicitud(
                idCredito
            );



        if(!solicitud){


            const datos =
            this.extraerDatos(
                texto,
                idCredito
            );


            await repository.crearSolicitud(datos);


            solicitud =
            await repository.buscarSolicitud(idCredito);

        }



        const existe =
        await repository.buscarSeguimiento(
            idCredito
        );



        if (existe) {

            throw new Error(
                "Esta solicitud ya tiene un seguimiento registrado."
            );

        }



        const seguimiento =
        await repository.crearSeguimiento({

            id_credit_form:idCredito,

            id_asesor:idAsesor

        });



        await repository.guardarDocumento({

            id_seguimiento:
            seguimiento.id_seguimiento,

            nombre_archivo:
            archivo.originalname,

            ruta_archivo:
            archivo.path

        });



        return {

            mensaje:
            "Seguimiento creado correctamente",

            solicitud,

            seguimiento

        };


    }


extraerCredito(texto) {


    const encontrado =
    texto.match(/(\d{4,})-\d+/);


    if(!encontrado){

        return null;

    }


    return Number(
        encontrado[1]
    );


}

extraerIdentificacion(texto){

    const encontrado =
    texto.match(/CC\s*(\d+)/);


    if(!encontrado){

        return null;

    }


    return encontrado[1];

}



    extraerDatos(texto,idCredito){


        return {


            id_credit:idCredito,


            num_identificacion:
            this.extraerCampo(
                texto,
                /CC\s*(\d+)/
            ),



            primer_nombre:"EDNA",

            segundo_nombre:"LUCENA",

            primer_apellido:"GARCIA",

            segundo_apellido:"RUIZ",



            vendedor:
            this.extraerLinea(
                texto,
                "Miguel Barbosa"
            ),



            sala:
            "AUTOVARDI",



            concesionario:
            "DISTRIBUIDORA NISSAN S.A.",



            marca:
            "NISSAN",



            tipo_vehiculo:
            "AUTOMOVIL",



            familia:
            "VERSA",



            version_vehiculo:
            "EXCLUSIVE",



            servicio:
            "PARTICULAR",



            plan_financiero:
            "PLAN MAS CERCA FD2",



            cuota_normal:
            3029269.32


        };


    }



    extraerCampo(texto, regex){


        const resultado =
        texto.match(regex);


        if(!resultado){

            return null;

        }


        return resultado[1];


    }




    extraerLinea(texto, valor){


        const posicion =
        texto.indexOf(valor);


        if(posicion === -1){

            return null;

        }


        return valor;


    }


}



module.exports = new PdfService();