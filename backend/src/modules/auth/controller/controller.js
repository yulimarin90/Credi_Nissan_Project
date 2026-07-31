const authService = require("../service/service");

class AuthController {

    async login(req, res) {

        try {

            const resultado = await authService.login(
                req.body.correo,
                req.body.password
            );

            res.status(200).json(resultado);

        } catch (error) {

            res.status(400).json({
                mensaje: error.message
            });

        }

    }

    async crearUsuario(req, res) {

        try {

            const resultado = await authService.crearUsuario(req.body);

            res.status(201).json(resultado);

        } catch (error) {

            res.status(400).json({
                mensaje: error.message
            });

        }

    }

    async cambiarPassword(req,res){

try{


const resultado =
await authService.cambiarPassword(
req.body.id_usuario,
req.body.password
);


res.json(resultado);



}catch(error){


res.status(400).json({

mensaje:error.message

});


}


}

    async activarUsuario(req, res) {

        try {

            const resultado = await authService.activarUsuario(
                req.params.id
            );

            res.json(resultado);

        } catch (error) {

            res.status(400).json({
                mensaje: error.message
            });

        }

    }

    async confirmarCorreo(req, res) {

        try {

            const resultado = await authService.confirmarCorreo(
                req.params.id
            );

            res.json(resultado);

        } catch (error) {

            res.status(400).json({
                mensaje: error.message
            });

        }

    }

    async desbloquearUsuario(req, res) {

        try {

            const resultado = await authService.desbloquearUsuario(
                req.params.id
            );

            res.json(resultado);

        } catch (error) {

            res.status(400).json({
                mensaje: error.message
            });

        }

    }

    async listarUsuarios(req, res) {

        try {

            const usuarios = await authService.listarUsuarios();

            res.json(usuarios);

        } catch (error) {

            res.status(400).json({
                mensaje: error.message
            });

        }

    }

}

module.exports = new AuthController();