const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    console.log("Authorization:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            mensaje: "Token requerido."
        });
    }

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Usuario:", usuario);

        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            mensaje: "Token inválido."
        });

    }

};