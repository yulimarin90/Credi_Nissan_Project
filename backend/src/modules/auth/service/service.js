const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("../repository/repository");

class AuthService {

    async login(correo, password) {

        const usuario = await authRepository.buscarPorCorreo(correo);

        if (!usuario) {
            throw new Error("Correo o contraseña incorrectos.");
        }

        if (!usuario.correo_confirmado) {
            throw new Error("Debe confirmar su correo electrónico.");
        }

        if (!usuario.activo) {
            throw new Error("Su usuario aún no ha sido activado por el Coordinador Operativo.");
        }

        if (usuario.bloqueado) {
            throw new Error("Usuario bloqueado. Contacte al Coordinador Operativo.");
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        if (!passwordCorrecta) {

            await authRepository.incrementarIntentos(usuario.id_usuario);

            const usuarioActualizado =
                await authRepository.buscarPorCorreo(correo);

            if (usuarioActualizado.intentos_fallidos >= 3) {

                await authRepository.bloquearUsuario(usuario.id_usuario);

                throw new Error(
                    "Usuario bloqueado por exceder el número de intentos."
                );

            }

            throw new Error("Correo o contraseña incorrectos.");

        }

        await authRepository.actualizarUltimoAcceso(usuario.id_usuario);

        const token = jwt.sign(

            {
                id: usuario.id_usuario,
                correo: usuario.correo,
                rol: usuario.rol
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES
            }

        );

        return {

            token,

            usuario: {

                id: usuario.id_usuario,
                nombre: usuario.nombre_completo,
                correo: usuario.correo,
                rol: usuario.rol

            }

        };

    }

    async crearUsuario(datos) {

        const existe = await authRepository.buscarPorCorreo(datos.correo);

        if (existe) {
            throw new Error("El correo ya se encuentra registrado.");
        }

        const passwordHash = await bcrypt.hash(datos.password, 10);

        await authRepository.crearUsuario({

            nombre_completo: datos.nombre_completo,
            correo: datos.correo,
            password_hash: passwordHash,
            id_rol: datos.id_rol,
            id_regional: datos.id_regional || null,
            id_sala: datos.id_sala || null

        });

        return {
            mensaje: "Usuario creado correctamente. Debe confirmar el correo y ser activado por el Coordinador Operativo."
        };

    }

    async activarUsuario(idUsuario) {

        const usuario = await authRepository.buscarPorId(idUsuario);

        if (!usuario) {
            throw new Error("Usuario no encontrado.");
        }

        await authRepository.activarUsuario(idUsuario);

        return {
            mensaje: "Usuario activado correctamente."
        };

    }

    async confirmarCorreo(idUsuario) {

        const usuario = await authRepository.buscarPorId(idUsuario);

        if (!usuario) {
            throw new Error("Usuario no encontrado.");
        }

        await authRepository.confirmarCorreo(idUsuario);

        return {
            mensaje: "Correo confirmado correctamente."
        };

    }

    async desbloquearUsuario(idUsuario) {

        const usuario = await authRepository.buscarPorId(idUsuario);

        if (!usuario) {
            throw new Error("Usuario no encontrado.");
        }

        await authRepository.desbloquearUsuario(idUsuario);

        return {
            mensaje: "Usuario desbloqueado correctamente."
        };

    }

    async listarUsuarios() {

        return await authRepository.listarUsuarios();

    }

}

module.exports = new AuthService();