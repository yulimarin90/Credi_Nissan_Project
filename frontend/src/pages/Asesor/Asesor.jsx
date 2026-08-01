import { useNavigate } from "react-router-dom";

function AsesorHome() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    return (
        <main className="app-shell">
            <header className="topbar">
                <a className="brand" href="/asesor"><span className="brand-mark">C</span> Credi Nissan</a>
                <div className="topbar-nav"><span className="client-id">{usuario.correo || "Asesor"}</span><button className="btn btn-dark" onClick={() => { localStorage.clear(); navigate("/"); }}>Salir</button></div>
            </header>
            <section className="page-wrap">
                <div className="page-heading"><div><span className="eyebrow">Espacio de trabajo</span><h1>Panel del asesor</h1><p>Organiza tus solicitudes y mantén el control de cada seguimiento.</p></div></div>
                <div className="stat-grid"><div className="stat-card"><span>Tu operación</span><strong>24/7</strong><span>Seguimiento siempre disponible</span></div><div className="stat-card"><span>Acceso rápido</span><strong>PDF</strong><span>Registra una solicitud en segundos</span></div><div className="stat-card"><span>Estado actual</span><strong>Activo</strong><span>Tu sesión está protegida</span></div></div>
                <div className="dashboard-grid">
                    <article className="action-card"><span className="kicker">01 · Captura</span><h3>Escanear cotización</h3><p>Sube un PDF y crea el seguimiento de una nueva solicitud.</p><button className="btn" onClick={() => navigate("/asesor/pdf")}>Subir PDF →</button></article>
                    <article className="action-card"><span className="kicker">02 · Gestión</span><h3>Mis clientes</h3><p>Consulta, actualiza y envía tus seguimientos a custodio.</p><button className="btn" onClick={() => navigate("/asesor/clientes")}>Ver seguimientos →</button></article>
                    <article className="action-card"><span className="kicker">03 · Próximamente</span><h3>Indicadores</h3><p>Visualiza el rendimiento de tu operación y sus avances.</p><button className="btn" onClick={() => navigate("/asesor/indicadores")}>Ver indicadores →</button></article>
                </div>
            </section>
        </main>
    );
}

export default AsesorHome;
