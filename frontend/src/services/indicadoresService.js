import api from "../api/axios";

export const obtenerIndicadores = async () => {
    try {
        const response = await api.get("/api/indicadores", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return { ok: true, datos: response.data };
    } catch (error) {
        return {
            ok: false,
            mensaje: error.response?.data?.mensaje || "No fue posible cargar los indicadores."
        };
    }
};
