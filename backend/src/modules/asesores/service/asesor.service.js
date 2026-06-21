const asesorRepository = require('../repository/asesor.repository');

const obtenerTodos = async () => {

    return await asesorRepository.obtenerTodos();

};

module.exports = {

    obtenerTodos

};