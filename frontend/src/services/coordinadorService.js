import api from "../api/axios";

const config = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const errorResult = (error, fallback) => ({ ok: false, mensaje: error.response?.data?.mensaje || fallback });

export const listarUsuarios = async () => { try { const r = await api.get("/api/coordinador/usuarios", config()); return { ok: true, datos: r.data }; } catch (e) { return errorResult(e, "No fue posible cargar los usuarios."); } };
export const activarUsuario = async (id) => { try { const r = await api.patch(`/api/coordinador/usuarios/${id}/activar`, {}, config()); return { ok: true, mensaje: r.data.mensaje }; } catch (e) { return errorResult(e, "No fue posible activar el usuario."); } };
export const desbloquearUsuario = async (id) => { try { const r = await api.patch(`/api/coordinador/usuarios/${id}/desbloquear`, {}, config()); return { ok: true, mensaje: r.data.mensaje }; } catch (e) { return errorResult(e, "No fue posible desbloquear el usuario."); } };
export const eliminarUsuario = async (id) => { try { const r = await api.delete(`/api/coordinador/usuarios/${id}`, config()); return { ok: true, mensaje: r.data.mensaje }; } catch (e) { return errorResult(e, "No fue posible eliminar el usuario."); } };
export const obtenerOperacion = async () => { try { const r = await api.get("/api/coordinador/operacion", config()); return { ok: true, datos: r.data }; } catch (e) { return errorResult(e, "No fue posible cargar los indicadores."); } };
export const listarClientesCoordinador = async (estatus) => { try { const r = await api.get(`/api/coordinador/clientes?estatus=${estatus}`, config()); return { ok: true, datos: r.data }; } catch (e) { return errorResult(e, "No fue posible cargar los clientes."); } };
