import api from "../api/axios";

export const importarExcel = async (archivo) => {
    const formulario = new FormData();
    formulario.append("archivo", archivo);

    try {
        const response = await api.post("/api/importador/importar", formulario, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return { ok: true, mensaje: response.data.mensaje };
    } catch (error) {
        return {
            ok: false,
            mensaje: error.response?.data?.mensaje || "No fue posible importar el Excel."
        };
    }
};
