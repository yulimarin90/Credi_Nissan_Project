import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../api/axios";


function CambiarPassword(){


const navigate = useNavigate();


const usuario =
JSON.parse(
localStorage.getItem("usuario")
);



const [password,setPassword]=useState("");

const [confirmar,setConfirmar]=useState("");



const validarPassword=(password)=>{


const regex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


return regex.test(password);


};



const cambiarPassword=async(e)=>{


e.preventDefault();



if(password !== confirmar){

alert(
"Las contraseñas no coinciden."
);

return;

}



if(!validarPassword(password)){


alert(
"La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
);


return;


}



try{


await api.patch(
"/api/auth/cambiar-password",
{

id_usuario: usuario.id,

password: password

}

);



alert(
"Contraseña actualizada correctamente."
);



localStorage.clear();


navigate("/");



}catch(error){


alert(

error.response?.data?.mensaje ||

"Error actualizando contraseña"

);


}



}




return(


<div>


<h1>
Cambio obligatorio de contraseña
</h1>



<p>
Por seguridad debes actualizar tu contraseña antes de continuar.
</p>



<form onSubmit={cambiarPassword}>


<input

type="password"

placeholder="Nueva contraseña"

value={password}

onChange={
(e)=>setPassword(e.target.value)
}

/>



<input

type="password"

placeholder="Confirmar contraseña"

value={confirmar}

onChange={
(e)=>setConfirmar(e.target.value)
}

/>



<button>

Guardar contraseña

</button>



</form>



</div>


)


}


export default CambiarPassword;