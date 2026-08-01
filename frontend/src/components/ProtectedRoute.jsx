import {Navigate} from "react-router-dom";


function ProtectedRoute({children, roles}){


const usuario =
JSON.parse(
localStorage.getItem("usuario")
);



console.log("USUARIO PROTECTED:", usuario);



if(!usuario){

    return <Navigate to="/" />;

}



if(
roles &&
!roles.includes(usuario.rol)
){

    console.log("ROL NO PERMITIDO");

    return <Navigate to="/" />;

}



return children;


}


export default ProtectedRoute;