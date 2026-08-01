import { useEffect, useState } from "react";
import {
    actualizarSeguimiento,
    eliminarSeguimiento,
    listarSeguimientos
} from "../../services/seguimientoService";

function nombreCliente(cliente) {
    return [
        cliente.primer_nombre,
        cliente.segundo_nombre,
        cliente.primer_apellido,
        cliente.segundo_apellido
    ].filter(Boolean).join(" ");
}

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    const cargarClientes = async () => {
        setCargando(true);
        const respuesta = await listarSeguimientos();
        setCargando(false);

        if (!respuesta.ok) {
            setTipoMensaje("error");
            setMensaje(respuesta.mensaje);
            return;
        }

        setClientes(respuesta.datos);
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const mostrarMensaje = (tipo, texto) => {
        setTipoMensaje(tipo);
        setMensaje(texto);
    };

    const enviarACustodio = async (cliente) => {
        const respuesta = await actualizarSeguimiento(
            cliente.id_seguimiento,
            { estatus_general: "Custodio" }
        );
        if (!respuesta.ok) {
            mostrarMensaje("error", respuesta.mensaje);
            await cargarClientes();
            return;
        }
        mostrarMensaje("exito", respuesta.mensaje);
        await cargarClientes();
    };

    const quitarSeguimiento = async (id) => {
        if (!window.confirm("¿Deseas quitar este cliente de tu seguimiento?")) {
            return;
        }

        const respuesta = await eliminarSeguimiento(id);
        if (!respuesta.ok) {
            mostrarMensaje("error", respuesta.mensaje);
            return;
        }

        mostrarMensaje("exito", respuesta.mensaje);
        setClientes((actuales) => actuales.filter(
            (cliente) => cliente.id_seguimiento !== id
        ));
    };

    return (
        <main className="app-shell">
            <header className="topbar"><a className="brand" href="/asesor"><span className="brand-mark">C</span> Credi Nissan</a><a className="btn btn-dark" href="/asesor">← Panel</a></header>
            <section className="page-wrap">
            <div className="page-heading"><div><span className="eyebrow">Gestión de cartera</span><h1>Mis clientes</h1><p>Seguimientos registrados por medio del escaneo de PDF.</p></div></div>

            {mensaje && (
                <div
                    role="alert"
                    style={{
                        color: tipoMensaje === "error" ? "#b91c1c" : "#166534",
                        margin: "1rem 0",
                        fontWeight: "600"
                    }}
                >
                    {mensaje}
                </div>
            )}

            {cargando ? <p>Cargando seguimientos...</p> : clientes.length === 0 ? (
                <p>No tienes seguimientos activos.</p>
            ) : (
                <div className="table-card"><div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Identificación</th>
                                <th>Crédito</th>
                                <th>Estatus general</th>
                                <th>Documento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => {
                                return (
                                    <tr key={cliente.id_seguimiento}>
                                        <td><div className="client-name">{nombreCliente(cliente)}</div><div className="client-id">Asesoría activa</div></td>
                                        <td>{cliente.num_identificacion || "-"}</td>
                                        <td>{cliente.id_credit_form}</td>
                                        <td>
                                            <span className={cliente.estatus_general === "Custodio" ? "badge badge-custodio" : "badge"}>{cliente.estatus_general ?? "NULL"}</span>
                                        </td>
                                        <td>{cliente.nombre_archivo || "-"}</td>
                                        <td><div className="row-actions">
                                            {cliente.estatus_general !== "Custodio" && <button className="btn btn-primary" onClick={() => enviarACustodio(cliente)}>Enviar a custodio</button>}
                                            <button onClick={() => quitarSeguimiento(cliente.id_seguimiento)}>Eliminar</button>
                                        </div></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div></div>
            )}
            </section>
        </main>
    );
}

export default Clientes;
