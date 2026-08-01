import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/authService";

function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre_completo: "", correo: "", password: "", id_regional: null, id_sala: null });
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("error");
    const [cargando, setCargando] = useState(false);
    const cambiarCampo = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const registrar = async (event) => {
        event.preventDefault();
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password)) {
            setTipoMensaje("error"); setMensaje("La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial."); return;
        }
        setCargando(true); setMensaje("");
        try {
            const respuesta = await registrarUsuario({
                ...form,
                id_regional: form.id_regional || null,
                id_sala: form.id_sala || null
            });
            setTipoMensaje("success"); setMensaje(respuesta.mensaje || "Usuario creado correctamente."); setTimeout(() => navigate("/"), 1200);
        }
        catch (error) { setTipoMensaje("error"); setMensaje(error.response?.data?.mensaje || "Error creando usuario."); }
        finally { setCargando(false); }
    };

    return <main className="auth-page">
        <section className="auth-showcase"><a className="brand brand-light" href="/"><span className="brand-mark">C</span> Credi Nissan</a><div className="showcase-content"><span className="kicker">Únete al equipo</span><h1>Construyamos el futuro <em>juntos.</em></h1><p>Crea tu acceso y empieza a trabajar con una operación más clara, ágil y conectada.</p></div><div className="showcase-orbit" aria-hidden="true" /></section>
        <section className="auth-panel"><div className="auth-card"><span className="eyebrow">Nuevo usuario</span><h2>Crear cuenta</h2><p className="form-intro">Completa tus datos para solicitar acceso.</p>{mensaje && <div className={`alert alert-${tipoMensaje}`} role="alert">{mensaje}</div>}
            <form className="form-stack" onSubmit={registrar}>
                <div className="form-field"><label htmlFor="nombre_completo">Nombre completo</label><input id="nombre_completo" name="nombre_completo" placeholder="Nombre completo" value={form.nombre_completo} onChange={cambiarCampo} required /></div>
                <div className="form-field"><label htmlFor="correo">Correo corporativo</label><input id="correo" type="email" name="correo" placeholder="usuario@empresa.com" value={form.correo} onChange={cambiarCampo} required /></div>
                <div className="form-field"><label htmlFor="id_regional">ID Regional <span className="optional">(opcional)</span></label><input id="id_regional" name="id_regional" type="number" placeholder="Se definirá más adelante" value={form.id_regional || ""} onChange={cambiarCampo} /></div>
                <div className="form-field"><label htmlFor="id_sala">ID Sala <span className="optional">(opcional)</span></label><input id="id_sala" name="id_sala" type="number" placeholder="Se definirá más adelante" value={form.id_sala || ""} onChange={cambiarCampo} /></div>
                <div className="form-field"><label htmlFor="registro-password">Contraseña</label><input id="registro-password" type="password" name="password" placeholder="Contraseña segura" value={form.password} onChange={cambiarCampo} required /></div>
                <button className="btn btn-primary btn-wide" type="submit" disabled={cargando}>{cargando ? "Creando..." : "Crear usuario"}<span>→</span></button>
            </form><div className="auth-footer">¿Ya tienes cuenta? <button type="button" onClick={() => navigate("/")}>Volver al inicio</button></div>
        </div></section>
    </main>;
}
export default Registro;
