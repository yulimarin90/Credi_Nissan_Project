import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";


import Login from "../pages/Login";
import Registro from "../pages/Registro";
import CambiarPassword from "../pages/CambiarPassword";

import Asesor from "../pages/Asesor/Asesor";
import Coordinador from "../pages/Coordinador";
import Director from "../pages/Director";
import EscanearPdf from "../pages/asesor/EscanearPDF";
import Clientes from "../pages/Asesor/Clientes";
import Indicadores from "../pages/Asesor/Indicadores";

import ProtectedRoute 
from "../components/ProtectedRoute";



function AppRoutes(){


return(

<BrowserRouter>


<Routes>



<Route
path="/"
element={<Login/>}
/>

<Route
path="/cambiar-password"
element={<CambiarPassword/>}
/>



<Route
path="/registro"
element={<Registro/>}
/>

<Route
path="/asesor/pdf"
element={<EscanearPdf/>}
/>

<Route
path="/asesor/clientes"
element={
<ProtectedRoute roles={["Asesor"]}>
<Clientes/>
</ProtectedRoute>
}
/>

<Route
path="/asesor/indicadores"
element={
<ProtectedRoute roles={["Asesor"]}>
<Indicadores/>
</ProtectedRoute>
}
/>

<Route

path="/asesor"

element={

<ProtectedRoute
roles={[
"Asesor"
]}
>

<Asesor/>

</ProtectedRoute>

}

/>



<Route

path="/coordinador"

element={

<ProtectedRoute
roles={[
"Coordinador Operativo",
"Coordinador operativo"
]}
>

<Coordinador/>

</ProtectedRoute>

}

/>



<Route

path="/director"

element={

<ProtectedRoute
roles={[
"Director"
]}
>

<Director/>

</ProtectedRoute>

}

/>



</Routes>



</BrowserRouter>


)

}



export default AppRoutes;