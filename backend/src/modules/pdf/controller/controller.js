const pdfService =
require("../service/service");


class PdfController{


async escanear(req,res){

try{

    const idAsesor = req.usuario.id_usuario;


    const resultado =
    await pdfService.escanear(
        req.file,
        req.usuario.id
    );


    res.json(resultado);


}catch(error){

    console.log("ERROR EN CONTROLLER:", error.message);

    return res.status(400).json({

        mensaje: error.message

    });

}

}


}





module.exports =
new PdfController();