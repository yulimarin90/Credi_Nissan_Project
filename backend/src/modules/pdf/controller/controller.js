const pdfService =
require("../service/service");


class PdfController{


async escanear(req,res){

try{

    const idAsesor = req.usuario.id_usuario;


    const resultado =
    await pdfService.escanear(
        req.file,
        idAsesor
    );


    res.json(resultado);


}catch (error) {

    console.error(error);

    res.status(500).json({
        mensaje: error.message,
        stack: error.stack
    });

}


}


}





module.exports =
new PdfController();