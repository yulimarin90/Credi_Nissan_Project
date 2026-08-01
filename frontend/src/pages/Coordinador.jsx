import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    activarUsuario,
    desbloquearUsuario,
    eliminarUsuario,
    listarClientesCoordinador,
    listarUsuarios,
    obtenerOperacion
} from "../services/coordinadorService";
import { importarExcel } from "../services/importadorService";

const numero = (valor) => Number(valor || 0);
const nombreCliente = (cliente) => [
    cliente.primer_nombre,
    cliente.segundo_nombre,
    cliente.primer_apellido,
    cliente.segundo_apellido
].filter(Boolean).join(" ");

function Modal({ titulo, children, cerrar }) {
    return (
        <div className="modal-backdrop" role="presentation" onClick={cerrar}>
            <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header"><div><span className="eyebrow">Vista detallada</span><h2 id="modal-titulo">{titulo}</h2></div><button className="modal-close" onClick={cerrar} aria-label="Cerrar">×</button></div>
                {children}
            </section>
        </div>
    );
}

function Coordinador() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [operacion, setOperacion] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [filtroUsuarios, setFiltroUsuarios] = useState("");
    const [filtroClientes, setFiltroClientes] = useState("");
    const [vistaClientes, setVistaClientes] = useState("Todos");
    const [detalle, setDetalle] = useState(null);
    const [verDistribucion, setVerDistribucion] = useState(false);
    const [verImportador, setVerImportador] = useState(false);
    const [archivoExcel, setArchivoExcel] = useState(null);
    const [importando, setImportando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargar = async () => {
        setCargando(true);
        const [usuariosRespuesta, operacionRespuesta, clientesRespuesta] = await Promise.all([
            listarUsuarios(), obtenerOperacion(), listarClientesCoordinador(vistaClientes)
        ]);
        setCargando(false);
        if (usuariosRespuesta.ok) setUsuarios(usuariosRespuesta.datos);
        if (operacionRespuesta.ok) setOperacion(operacionRespuesta.datos);
        if (clientesRespuesta.ok) setClientes(clientesRespuesta.datos);
        const error = [usuariosRespuesta, operacionRespuesta, clientesRespuesta].find((respuesta) => !respuesta.ok);
        if (error) setMensaje(error.mensaje);
    };

    useEffect(() => { cargar(); }, [vistaClientes]);

    const usuariosFiltrados = useMemo(() => usuarios.filter((usuario) => `${usuario.nombre_completo} ${usuario.correo} ${usuario.id_sala || ""} ${usuario.id_regional || ""}`.toLowerCase().includes(filtroUsuarios.toLowerCase())), [usuarios, filtroUsuarios]);
    const clientesFiltrados = useMemo(() => clientes.filter((cliente) => `${nombreCliente(cliente)} ${cliente.num_identificacion || ""} ${cliente.asesor || ""}`.toLowerCase().includes(filtroClientes.toLowerCase())), [clientes, filtroClientes]);
    const ejecutar = async (accion) => { const respuesta = await accion(); setMensaje(respuesta.mensaje); if (respuesta.ok) await cargar(); };
    const salir = () => { localStorage.clear(); navigate("/"); };
    const importar = async (event) => {
        event.preventDefault();
        if (!archivoExcel) {
            setMensaje("Selecciona un archivo Excel.");
            return;
        }
        setImportando(true);
        const respuesta = await importarExcel(archivoExcel);
        setImportando(false);
        setMensaje(respuesta.mensaje);
        if (respuesta.ok) {
            setArchivoExcel(null);
            setVerImportador(false);
            await cargar();
        }
    };

    if (cargando && !operacion) return <main className="app-shell"><section className="page-wrap"><p>Cargando operación...</p></section></main>;

    return (
        <main className="app-shell">
            <header className="topbar"><a className="brand" href="/coordinador"><span className="brand-mark">C</span> Credi Nissan</a><div className="topbar-nav"><span className="client-id">Coordinador Operativo</span><button className="btn btn-dark" onClick={salir}>Salir</button></div></header>
            <section className="page-wrap">
                <div className="page-heading"><div><span className="eyebrow">Control de operación</span><h1>Panel coordinador</h1><p>Administra accesos y consulta la operación completa.</p></div><div className="topbar-nav"><button className="btn btn-primary" onClick={() => setVerImportador(true)}>Cargar Excel base</button><button className="btn btn-dark" onClick={cargar}>Actualizar</button></div></div>
                {mensaje && <div className="alert alert-success" role="alert">{mensaje}</div>}
                {operacion && <div className="stat-grid"><div className="stat-card"><span>Seguimientos activos</span><strong>{numero(operacion.resumen?.total)}</strong></div><div className="stat-card"><span>En estudio / pendientes</span><strong>{numero(operacion.resumen?.pendientes)}</strong></div><div className="stat-card"><span>En custodio</span><strong>{numero(operacion.resumen?.custodio)}</strong></div></div>}

                <section className="indicator-section"><div className="section-title"><span className="kicker">01 · Accesos</span><h2>Usuarios</h2><p>Activa, desbloquea o elimina cuentas registradas.</p></div><div className="toolbar"><input className="search" placeholder="Buscar por nombre, correo, sala o regional" value={filtroUsuarios} onChange={(event) => setFiltroUsuarios(event.target.value)} /></div><div className="table-card"><div className="table-scroll"><table><thead><tr><th>Usuario</th><th>Rol</th><th>Sala</th><th>Regional</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{usuariosFiltrados.map((usuario) => <tr key={usuario.id_usuario}><td><strong>{usuario.nombre_completo}</strong><div className="client-id">{usuario.correo}</div></td><td>{usuario.rol}</td><td>{usuario.id_sala ?? "NULL"}</td><td>{usuario.id_regional ?? "NULL"}</td><td><span className={usuario.bloqueado ? "badge" : usuario.activo ? "badge badge-custodio" : "badge"}>{usuario.bloqueado ? "Bloqueado" : usuario.activo ? "Activo" : "Pendiente"}</span></td><td><div className="row-actions">{!usuario.activo && <button className="btn btn-primary" onClick={() => ejecutar(() => activarUsuario(usuario.id_usuario))}>Activar</button>}{usuario.bloqueado && <button className="btn btn-dark" onClick={() => ejecutar(() => desbloquearUsuario(usuario.id_usuario))}>Desbloquear</button>}<button className="btn btn-danger" onClick={() => window.confirm("¿Eliminar este usuario?") && ejecutar(() => eliminarUsuario(usuario.id_usuario))}>Eliminar</button></div></td></tr>)}</tbody></table></div></div></section>

                <section className="indicator-section"><div className="section-title"><span className="kicker">02 · Seguimientos</span><h2>Clientes activos</h2><p>Todos los seguimientos activos de la operación. Abre cada registro para consultar el detalle.</p></div><div className="toolbar"><input className="search" placeholder="Buscar por cliente, cédula o asesor" value={filtroClientes} onChange={(event) => setFiltroClientes(event.target.value)} /><div className="topbar-nav"><button className={vistaClientes === "Todos" ? "btn btn-primary" : "btn btn-dark"} onClick={() => setVistaClientes("Todos")}>Todos</button><button className={vistaClientes === "Pendiente" ? "btn btn-primary" : "btn btn-dark"} onClick={() => setVistaClientes("Pendiente")}>Pendientes</button><button className={vistaClientes === "Custodio" ? "btn btn-primary" : "btn btn-dark"} onClick={() => setVistaClientes("Custodio")}>En custodio</button></div></div><div className="table-card"><div className="table-scroll"><table><thead><tr><th>Cliente</th><th>Cédula</th><th>Crédito</th><th>Asesor</th><th>Estatus</th><th>Detalle</th></tr></thead><tbody>{clientesFiltrados.map((cliente) => <tr key={cliente.id_seguimiento}><td><strong>{nombreCliente(cliente)}</strong></td><td>{cliente.num_identificacion || "-"}</td><td>{cliente.id_credit_form}</td><td>{cliente.asesor}</td><td><span className={cliente.estatus_general === "Custodio" ? "badge badge-custodio" : "badge"}>{cliente.estatus_general ?? "NULL"}</span></td><td><button className="btn btn-dark" onClick={() => setDetalle(cliente)}>Ver detalle</button></td></tr>)}</tbody></table></div></div></section>

                <section className="indicator-section"><div className="section-title"><span className="kicker">03 · Distribución</span><h2>Operación por sala y regional</h2><p>Consulta la distribución en una ventana independiente.</p></div><button className="btn btn-primary" onClick={() => setVerDistribucion(true)}>Ver distribución completa →</button></section>
            </section>

            {detalle && <Modal titulo={nombreCliente(detalle)} cerrar={() => setDetalle(null)}><div className="detail-grid"><div><span>Identificación</span><strong>{detalle.num_identificacion || "NULL"}</strong></div><div><span>Crédito</span><strong>{detalle.id_credit_form}</strong></div><div><span>Estatus general</span><strong>{detalle.estatus_general ?? "NULL"}</strong></div><div><span>Asesor</span><strong>{detalle.asesor}</strong></div><div><span>Regional / sala</span><strong>{detalle.id_regional ?? "NULL"} / {detalle.id_sala ?? "NULL"}</strong></div><div><span>Fecha de escaneo</span><strong>{detalle.fecha_escaneo ? new Date(detalle.fecha_escaneo).toLocaleString("es-CO") : "NULL"}</strong></div><div><span>Vendedor</span><strong>{detalle.vendedor || "NULL"}</strong></div><div><span>Concesionario</span><strong>{detalle.concesionario || "NULL"}</strong></div><div><span>Vehículo</span><strong>{[detalle.marca, detalle.tipo_vehiculo, detalle.familia, detalle.version_vehiculo].filter(Boolean).join(" · ") || "NULL"}</strong></div><div><span>Plan financiero</span><strong>{detalle.plan_financiero || "NULL"}</strong></div><div><span>Cuota normal</span><strong>{detalle.cuota_normal ?? "NULL"}</strong></div><div><span>Documento PDF</span><strong>{detalle.nombre_archivo || "NULL"}</strong></div></div></Modal>}
            {verDistribucion && <Modal titulo="Distribución operativa" cerrar={() => setVerDistribucion(false)}><div className="table-card modal-table"><div className="table-scroll"><table><thead><tr><th>Regional</th><th>Sala</th><th>Total</th><th>Pendientes</th><th>Custodio</th></tr></thead><tbody>{(operacion?.distribucion || []).map((registro, indice) => <tr key={`${registro.id_regional}-${registro.id_sala}-${indice}`}><td>{registro.id_regional ?? "NULL"}</td><td>{registro.id_sala ?? "NULL"}</td><td>{numero(registro.total)}</td><td>{numero(registro.pendientes)}</td><td>{numero(registro.custodio)}</td></tr>)}</tbody></table></div></div></Modal>}
            {verImportador && <Modal titulo="Cargar Excel base" cerrar={() => { setVerImportador(false); setArchivoExcel(null); }}><form className="form-stack" onSubmit={importar}><div className="upload-zone"><span className="upload-icon">↥</span><h2>Actualizar solicitudes</h2><p>Los créditos nuevos se insertarán y los existentes se actualizarán.</p><input id="excel-base" type="file" accept=".xlsx,.xls" onChange={(event) => setArchivoExcel(event.target.files[0])} required /><label className="btn btn-dark" htmlFor="excel-base">Seleccionar Excel</label>{archivoExcel && <strong className="file-name">{archivoExcel.name}</strong>}</div><button className="btn btn-primary btn-wide" type="submit" disabled={importando}>{importando ? "Importando..." : "Importar y actualizar"}<span>→</span></button></form></Modal>}
        </main>
    );
}

export default Coordinador;
