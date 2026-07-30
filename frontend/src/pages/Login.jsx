import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const iniciarSesion = async (e) => {

        e.preventDefault();

        try{

            const respuesta = await login(correo,password);

            localStorage.setItem("token",respuesta.token);

            navigate("/dashboard");

        }catch(error){

            alert(error.response.data.mensaje);

        }

    }

    return(

        <div>

            <h1>Credi Nissan</h1>

            <form onSubmit={iniciarSesion}>

                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e)=>setCorreo(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button>

                    Iniciar sesión

                </button>

            </form>

        </div>

    )

}

export default Login;