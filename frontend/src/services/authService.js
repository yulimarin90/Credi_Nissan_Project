import api from "../api/axios";

export const login = async (correo, password) => {

   const response = await api.post("/api/auth/login", {
    correo,
    password
});

    return response.data;

};

export const registrarUsuario = async(datos)=>{

const response =
await api.post(
"/api/auth/usuarios",
datos
);

return response.data;

};