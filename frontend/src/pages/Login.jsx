import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (event) => {
        event.preventDefault();
        setMensaje("");
        setCargando(true);
        try {
            const respuesta = await login(correo, password);
            localStorage.setItem("token", respuesta.token);
            localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));
            if (respuesta.cambiarPassword) { navigate("/cambiar-password"); return; }
            const rutas = { Asesor: "/asesor", "Coordinador Operativo": "/coordinador", Director: "/director" };
            navigate(rutas[respuesta.usuario.rol] || "/");
        } catch (error) {
            setMensaje(error.response?.data?.mensaje || "No fue posible iniciar sesión.");
        } finally { setCargando(false); }
    };

    return (
        <main className="auth-page">
            <section className="auth-showcase">
                <a className="brand brand-light" href="/"><span className="brand-mark">C</span> Credi Nissan</a>
                <div className="showcase-content"><span className="kicker">Plataforma de crédito</span><h1>Gestiona el movimiento de cada <em>oportunidad.</em></h1><p>Un espacio claro para convertir solicitudes en decisiones y seguimiento.</p></div>
                <div className="showcase-orbit" aria-hidden="true" />
            </section>
            <section className="auth-panel"><div className="auth-card">
                <span className="eyebrow">Portal empresarial</span><h2>Bienvenido</h2><p className="form-intro">Ingresa para continuar con tu operación.</p>
                {mensaje && <div className="alert alert-error" role="alert">{mensaje}</div>}
                <form className="form-stack" onSubmit={iniciarSesion}>
                    <div className="form-field"><label htmlFor="correo">Correo electrónico</label><input id="correo" type="email" placeholder="correo@empresa.com" value={correo} onChange={(event) => setCorreo(event.target.value)} required /></div>
                    <div className="form-field"><label htmlFor="password">Contraseña</label><input id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
                    <button className="btn btn-primary btn-wide" type="submit" disabled={cargando}>{cargando ? "Ingresando..." : "Ingresar al portal"}<span>→</span></button>
                </form>
                <div className="auth-footer">¿No tienes cuenta? <button type="button" onClick={() => navigate("/registro")}>Crear una cuenta</button></div>
            </div></section>
        </main>
    );
}
export default Login;
