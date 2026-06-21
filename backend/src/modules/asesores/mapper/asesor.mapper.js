const toDTO = (asesor) => {

    return {

        id: asesor.id,
        nombre: asesor.nombre,
        apellido: asesor.apellido,
        correo: asesor.correo

    };

};

module.exports = {

    toDTO

};