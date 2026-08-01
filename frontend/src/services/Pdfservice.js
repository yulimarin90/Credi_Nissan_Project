import api from "../api/axios";

export const escanearPdf = async (archivo)=>{

    const formData = new FormData();

    formData.append(
        "archivo",
        archivo
    );


    const token = localStorage.getItem("token");


    try {

        const response = await api.post(
            "/api/pdf/scan",
            formData,
            {
                headers:{
                    "Content-Type":"multipart/form-data",
                    Authorization:`Bearer ${token}`
                }
            }
        );


        return response.data;


    } catch(error) {

        return {
            ok: false,
            mensaje:
            error.response?.data?.mensaje ||
            "Error procesando PDF"
        };

    }

};