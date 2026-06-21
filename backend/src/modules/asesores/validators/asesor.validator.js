const validarAsesor = (asesor) => {

    if (!asesor.nombre) {

        throw new Error("El nombre es obligatorio");

    }

    return true;

};

module.exports = {

    validarAsesor

};