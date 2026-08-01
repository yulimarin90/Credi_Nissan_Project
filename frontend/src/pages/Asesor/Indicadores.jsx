import { useEffect, useMemo, useState } from "react";
import { obtenerIndicadores } from "../../services/indicadoresService";

function numero(valor) {
    return Number(valor || 0);
}

function Indicadores() {
    const [datos, setDatos] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarIndicadores = async () => {
        setCargando(true);
        const respuesta = await obtenerIndicadores();
        setCargando(false);
        if (!respuesta.ok) {
            setMensaje(respuesta.mensaje);
            return;
        }
        setDatos(respuesta.datos);
    };

    useEffect(() => { cargarIndicadores(); }, []);

    const grupal = datos?.grupal || [];
    const resumenGrupal = useMemo(() => ({
        total: grupal.reduce((suma, item) => suma + numero(item.total), 0),
        custodio: grupal.reduce((suma, item) => suma + numero(item.custodio), 0),
        enEstudio: grupal.reduce((suma, item) => suma + numero(item.en_estudio), 0)
    }), [grupal]);

    if (cargando) {
        return <main className="app-shell"><section className="page-wrap"><p>Cargando indicadores...</p></section></main>;
    }

    if (mensaje) {
        return <main className="app-shell"><section className="page-wrap"><div className="alert alert-error" role="alert">{mensaje}</div></section></main>;
    }

    const personal = datos?.personal || {};

    return (
        <main className="app-shell">
            <header className="topbar"><a className="brand" href="/asesor"><span className="brand-mark">C</span> Credi Nissan</a><a className="btn btn-dark" href="/asesor">← Panel</a></header>
            <section className="page-wrap">
                <div className="page-heading"><div><span className="eyebrow">Rendimiento de operación</span><h1>Indicadores</h1><p>Consulta tu actividad y la de los asesores que pertenecen a tu misma sala.</p></div><button className="btn btn-primary" onClick={cargarIndicadores}>Actualizar</button></div>

                <section className="indicator-section"><div className="section-title"><span className="kicker">01 · Personal</span><h2>Mi operación</h2></div>
                    <div className="indicator-grid"><div className="indicator-card indicator-card-main"><span>Total seguimientos activos</span><strong>{numero(personal.total)}</strong><small>Registrados por ti</small></div><div className="indicator-card"><span>En estudio</span><strong>{numero(personal.en_estudio)}</strong><small>Por gestionar</small></div><div className="indicator-card"><span>En custodio</span><strong>{numero(personal.custodio)}</strong><small>Enviados por ti</small></div></div>
                </section>

                <section className="indicator-section"><div className="section-title"><span className="kicker">02 · Grupal</span><h2>Equipo de tu sala</h2><p>Asesores asociados a la misma sala.</p></div>
                    {grupal.length === 0 ? <div className="panel-card empty-state">No hay asesores asociados a una sala para mostrar indicadores grupales.</div> : <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Asesor</th><th>Correo</th><th>Total</th><th>En estudio</th><th>Custodio</th></tr></thead><tbody>{grupal.map((asesor) => <tr key={asesor.id_usuario}><td><strong>{asesor.nombre_completo}</strong></td><td>{asesor.correo}</td><td><span className="badge">{numero(asesor.total)}</span></td><td>{numero(asesor.en_estudio)}</td><td><span className="badge badge-custodio">{numero(asesor.custodio)}</span></td></tr>)}</tbody></table></div></div>}
                </section>

                <section className="indicator-section"><div className="section-title"><span className="kicker">Resumen</span><h2>Actividad de la sala</h2></div><div className="stat-grid"><div className="stat-card"><span>Seguimientos del equipo</span><strong>{resumenGrupal.total}</strong></div><div className="stat-card"><span>En estudio</span><strong>{resumenGrupal.enEstudio}</strong></div><div className="stat-card"><span>En custodio</span><strong>{resumenGrupal.custodio}</strong></div></div></section>
            </section>
        </main>
    );
}

export default Indicadores;
