import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { escanearPdf } from "../../services/Pdfservice";

function EscanearPdf() {
    const navigate = useNavigate();
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const subirPdf = async (event) => {
        event.preventDefault();
        if (!archivo) { setTipoMensaje("error"); setMensaje("Selecciona un archivo PDF para continuar."); return; }
        setCargando(true); setMensaje("");
        try {
            const respuesta = await escanearPdf(archivo);
            if (respuesta?.ok === false) { setTipoMensaje("error"); setMensaje(respuesta.mensaje); return; }
            setTipoMensaje("success"); setMensaje(respuesta?.mensaje || "Seguimiento creado correctamente.");
            setArchivo(null);
            event.target.reset();
        } catch (error) { setTipoMensaje("error"); setMensaje(error?.mensaje || "Error procesando el PDF."); }
        finally { setCargando(false); }
    };

    return (
        <main className="app-shell">
            <header className="topbar"><a className="brand" href="/asesor"><span className="brand-mark">C</span> Credi Nissan</a><button className="btn btn-dark" onClick={() => navigate("/asesor")}>← Panel</button></header>
            <section className="page-wrap">
                <div className="page-heading"><div><span className="eyebrow">Captura de información</span><h1>Escanear cotización</h1><p>Extrae la información de tu PDF y crea un seguimiento automáticamente.</p></div></div>
                <div className="panel-card" style={{ padding: "clamp(24px, 5vw, 56px)", maxWidth: "720px" }}>
                    <form onSubmit={subirPdf} className="form-stack">
                        <div className="upload-zone"><span className="upload-icon">↥</span><h2>Arrastra tu cotización aquí</h2><p>o selecciona un archivo PDF desde tu equipo</p><input id="archivo" type="file" accept="application/pdf" onChange={(event) => setArchivo(event.target.files[0])} required /><label htmlFor="archivo" className="btn btn-dark">Seleccionar PDF</label>{archivo && <strong className="file-name">{archivo.name}</strong>}</div>
                        {mensaje && <div className={`alert alert-${tipoMensaje}`} role="alert">{mensaje}</div>}
                        <button className="btn btn-primary btn-wide" type="submit" disabled={cargando}>{cargando ? "Procesando documento..." : "Crear seguimiento"}<span>→</span></button>
                    </form>
                </div>
            </section>
        </main>
    );
}
export default EscanearPdf;
