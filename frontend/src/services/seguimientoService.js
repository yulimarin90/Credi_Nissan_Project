import api from "../api/axios";

const configuracion = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

const mensajeError = (error, fallback) => ({
    ok: false,
    mensaje: error.response?.data?.mensaje || fallback
});

export const listarSeguimientos = async () => {
    try {
        const response = await api.get("/api/seguimientos", configuracion());
        return { ok: true, datos: response.data };
    } catch (error) {
        return mensajeError(error, "No fue posible cargar tus seguimientos.");
    }
};

export const actualizarSeguimiento = async (id, datos) => {
    try {
        const response = await api.patch(
            `/api/seguimientos/${id}`,
            datos,
            configuracion()
        );
        return { ok: true, mensaje: response.data.mensaje };
    } catch (error) {
        return mensajeError(error, "No fue posible actualizar el seguimiento.");
    }
};

export const eliminarSeguimiento = async (id) => {
    try {
        const response = await api.delete(
            `/api/seguimientos/${id}`,
            configuracion()
        );
        return { ok: true, mensaje: response.data.mensaje };
    } catch (error) {
        return mensajeError(error, "No fue posible eliminar el seguimiento.");
    }
};
