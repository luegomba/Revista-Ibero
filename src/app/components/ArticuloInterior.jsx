/* src/app/components/ArticuloInterior.jsx*/
import Image from "next/image";

export default function ArticuloInterior({
                                             revistaNumero,            // string: "número 96 | ..."
                                             titulo,                   // string
                                             subtitulo,                // string
                                             autorNombre,              // string
                                             autorBio,                 // string (o HTML)
                                             autorFotoUrl,             // string /uploads/... (o absoluta)
                                             audioSrc,                 // string (mp3) opcional
                                             secciones = [],           // [{id: "sub-1", label:"..."}, ...]
                                             htmlContenido,            // HTML del artículo (string)
                                             referencias = [],         // [{texto: "...", href:"..."}]
                                         }) {
    // Normaliza URL de imagen/MP3 si vienen relativos desde Strapi
    const norm = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${process.env.NEXT_PUBLIC_API_FILES_BASE || "http://localhost:1337"}${url}`;
    };

    const foto = norm(autorFotoUrl);
    const mp3  = norm(audioSrc);

    return (
        <div id="revista-container" className="container">
            {/* ASIDE (autor + navegación) */}
            <aside id="nav-content">
                {/* Autor */}
                <section className="article-author">
                    <h4 className="author">{autorNombre}</h4>
                    <p className="author-abstract">
                        {foto ? (
                            <img src={foto} alt={autorNombre} />
                        ) : null}
                        {autorBio}
                    </p>
                </section>

                {/* Navegación por secciones */}
                {secciones.length > 0 && (
                    <section className="article-navigation">
                        <h6>en este artículo</h6>
                        <ul>
                            {secciones.map((s) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`}>{s.label}</a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </aside>

            {/* MAIN */}
            <main id="content">
                <div className="upper-info">
                    {revistaNumero ? (
                        <p className="revista-title">{revistaNumero}</p>
                    ) : null}
                </div>

                <article className="ibero">
                    <div className="headings">
                        <h1 className="article-title">{titulo}</h1>
                        {subtitulo ? <h2 className="article-subtitle">{subtitulo}</h2> : null}
                    </div>

                    <div className="article-media">
                        {/* Bloque de audio (opcional) */}
                        {mp3 ? (
                            <>
                                <div className="audio-info">
                                    <h3 className="audio-title show">
                    <span
                        className="marquee-content"
                        data-text={`${titulo} | ${subtitulo || ""}`}
                    >
                      {titulo} {subtitulo ? `| ${subtitulo}` : ""}
                    </span>
                                    </h3>
                                    <p className="audio-description">Escucha este artículo:</p>
                                </div>

                                <div className="audio-container">
                                    <div className="audio-player">
                                        {/* Controles simples nativos: puedes reemplazar por tu JS custom luego */}
                                        <audio controls preload="metadata" style={{ width: "100%" }}>
                                            <source src={mp3} type="audio/mpeg" />
                                            Tu navegador no soporta audio HTML5.
                                        </audio>
                                    </div>
                                </div>

                                <div className="options">
                                    <button className="share tooltip-css" aria-label="share" data-tooltip="Compartir artículo">
                                        {/* icono lo maneja tu CSS */}
                                        <svg width="0" height="0" />
                                    </button>
                                    <button className="download tooltip-css" aria-label="download" data-tooltip="Descargar artículo">
                                        <svg width="0" height="0" />
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Autor en mobile */}
                    <section className="article-author mobile">
                        <h4 className="author">{autorNombre}</h4>
                        <p className="author-abstract">
                            {foto ? (
                                <img src={foto} alt={autorNombre} />
                            ) : null}
                            {autorBio}
                        </p>
                    </section>

                    {/* CONTENIDO */}
                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: htmlContenido || "" }}
                    />

                    {/* Referencias */}
                    {referencias.length > 0 && (
                        <blockquote className="article-references">
                            <h5 className="article-references-title" id="sub-refs">Referencias</h5>
                            <ul>
                                {referencias.map((ref, i) => (
                                    <li key={i}>
                                        {ref.href ? (
                                            <a href={ref.href} target="_blank" rel="noreferrer">{ref.texto}</a>
                                        ) : (
                                            <span>{ref.texto}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </blockquote>
                    )}
                </article>
            </main>

            {/* botón “arriba” (tu CSS ya lo estiliza) */}
            <button className="scroll-to-top" id="scrollToTopBtn" aria-label="Scroll to top">
                <img src="/img/up.svg" alt="" />
            </button>
        </div>
    );
}
