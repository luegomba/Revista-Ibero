// src/app/directorio/page.jsx

export const metadata = {
    title: "Directorio | Revista IBERO",
    description: "Directorio editorial de la Revista de la Universidad Iberoamericana.",
};

const miembros = [
    { nombre: "Dr. Luis Arriaga Valenzuela, S. J.", cargo: "Rector" },
    { nombre: "Dr. Alejandro Anaya Muñoz", cargo: "Vicerrector Académico" },
];

const consejo = [
    "Joseba Buj Corrales",
    "Felipe Canudas Orezza Ugalde",
    "Begoña Guadalupe Irazábal Valdéz",
    "Mónica Maccise Duayhe",
    "Carlos Esteban Romero Álvarez",
    "Valeria Villalobos Guízar",
];

const equipo = [
    { nombre: "Sophie Anaya Levesque", cargo: "Directora general" },
    { nombre: "Francisco Castro Merrifield y Luis Medina Gual", cargo: "Dirección huésped" },
    { nombre: "Juan Domingo Argüelles", cargo: "Director editorial" },
    { nombre: "Beatriz Palacios", cargo: "Asistente editorial" },
    { nombre: "María Magdalena Cobá Pastrana", cargo: "Administración" },
    { nombre: "Jorge Cervantes Magaña", cargo: "Información" },
];

const disenio = [
    "Diana Karina Rivera Esparza",
    "Ernesto Cerna Landa",
    "Julio César López",
    "Héctor Raúl Pérez Cortés",
];

const redaccion = [
    "Mariana Domínguez Batis",
    "Alberto Hernández Mendoza",
    "Elihú Alberto Cortés Hernández",
    "Luis Alberto Reyes Rodríguez",
    "Jorge Luis Cortés García",
];

export default function DirectorioPage() {
    return (
        <div id="revista-container" className="container directorio">
            <aside>
                <section className="legal">
                    <p>
                        <b>IBERO, REVISTA DE LA UNIVERSIDAD IBEROAMERICANA</b> es una publicación
                        bimestral de la Universidad Iberoamericana, A. C., bajo la responsabilidad
                        de la Dirección de Comunicación Institucional de la Ibero.<br /><br />
                        <b>Editora responsable:</b> Sophie Anaya Levesque,{" "}
                        <a href="mailto:sophie.anaya@ibero.mx">sophie.anaya@ibero.mx</a>.<br /><br />
                        Número de Certificado de Reserva al Uso Exclusivo 04-2015-121718193300-102,{" "}
                        <b>ISSN:</b> 2594-2662 ambos otorgados por el Instituto Nacional de Derechos
                        de Autor.<br /><br />
                        <b>Número de Certificado de Licitud de Título y Contenido:</b> 16797,
                        otorgado por la Comisión Calificadora de Publicaciones y Revistas Ilustradas
                        de la Secretaría de Gobernación.<br /><br />
                        <b>Domicilio de la publicación:</b> Prolongación Paseo de la Reforma 880,
                        Lomas de Santa Fe, Ciudad de México, C. P. 01219. Teléfonos 55-5950-4197 y
                        55-5950-4198.<br /><br />
                        La responsabilidad de los artículos publicados refleja, de manera exclusiva,
                        la opinión de sus autores y no necesariamente el criterio de la Universidad
                        Iberoamericana.<br /><br />
                        Prohibida la reproducción parcial o total, por cualquier medio o
                        procedimiento, del contenido de la revista, sin autorización previa y
                        expresa, por escrito, de la Universidad Iberoamericana Ciudad de México.
                    </p>
                </section>
            </aside>

            <main id="content">
                <article className="index directorio">

                    <div className="headings">
                        <h1 className="article-title">Revista IBERO</h1>
                        <h2 className="article-subtitle">Directorio</h2>
                    </div>

                    <div className="directorio-container">

                        {/* Universidad */}
                        <h3>UNIVERSIDAD IBEROAMERICANA<br />CIUDAD DE MÉXICO</h3>

                        {miembros.map((m) => (
                            <p key={m.nombre} className="member">
                                <span className="name">{m.nombre}</span>
                                <span className="position">{m.cargo}</span>
                            </p>
                        ))}

                        {/* Consejo Editorial */}
                        <div className="member">
                            <p className="position">Consejo Editorial</p>
                            <ul className="editorial">
                                {consejo.map((nombre) => (
                                    <li key={nombre}>{nombre}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Equipo */}
                        {equipo.map((m) => (
                            <p key={m.nombre} className="member">
                                <span className="name">{m.nombre}</span>
                                <span className="position">{m.cargo}</span>
                            </p>
                        ))}

                        {/* Diseño */}
                        <div className="member">
                            <p className="position">Diseño</p>
                            <ul className="editorial">
                                {disenio.map((nombre) => (
                                    <li key={nombre}>{nombre}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Redacción */}
                        <div className="member">
                            <p className="position">Redacción</p>
                            <ul className="editorial">
                                {redaccion.map((nombre) => (
                                    <li key={nombre}>{nombre}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Contacto */}
                        <p className="member">
                            <span className="contact">
                                <em>
                                    <a href="mailto:revistaibero@ibero.mx">revistaibero@ibero.mx</a>
                                </em>
                            </span>
                        </p>

                    </div>
                </article>
            </main>
        </div>
    );
}
