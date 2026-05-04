/* src/app/components/ArticuloInterior.jsx */
import ArticleInteractions from "./ArticleInteractions";

export default function ArticuloInterior({
    revistaNumero,            // string: "número 96"
    revistaTitulo,            // string: título temático de la revista
    portadaUrl,               // string: URL de la portada thumbnail
    titulo,                   // string
    subtitulo,                // string
    autorNombre,              // string
    autorBio,                 // string
    autorFotoUrl,             // string /uploads/... (o absoluta)
    imagenUrl,                // string: imagen principal del artículo (para el player-art)
    audioSrc,                 // string (mp3) opcional
    secciones = [],           // [{id: "sub-1", label:"..."}, ...]
    htmlContenido,            // HTML del artículo (string)
    referencias = [],         // [{texto: "...", href:"..."}]
    prevArticle = null,       // URL artículo anterior
    nextArticle = null,       // URL artículo siguiente
}) {
    // Normaliza URL de imagen/MP3 si vienen relativos desde Strapi
    const norm = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${process.env.NEXT_PUBLIC_API_FILES_BASE || "http://localhost:1337"}${url}`;
    };

    const foto = norm(autorFotoUrl);
    const mp3 = norm(audioSrc);

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
                        {portadaUrl && (
                            <section className="portada-revista">
                                <img
                                    src={portadaUrl}
                                    alt={revistaNumero ? `Portada ${revistaNumero}` : "Portada de la revista"}
                                />
                            </section>
                        )}
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
                    {(revistaNumero || revistaTitulo) ? (
                        <p className="revista-title">
                            {revistaNumero}
                            {revistaNumero && revistaTitulo ? " | " : ""}
                            {revistaTitulo}
                        </p>
                    ) : null}
                </div>

                <article className="ibero">
                    <div className="headings">
                        <h1 className="article-title">{titulo}</h1>
                        {subtitulo ? <h2 className="article-subtitle">{subtitulo}</h2> : null}
                    </div>

                    {/* ── PLAYER DE AUDIO CUSTOM ─────────────────────── */}
                    <div className="article-media" id="articleMedia">

                        {/* Botón cerrar player en mobile */}
                        <button id="mobile-player-close" aria-label="Cerrar reproductor">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27">
                                <path className="cls-1" d="M17,12.34l4.86-4.84c-.25-.4-.6-.84-1.06-1.3-.46-.47-.89-.81-1.29-1.05l-4.86,4.84c-.17.17-.39.41-.65.71-.2.22-.35.37-.5.53-.15-.15-.31-.3-.5-.53-.26-.3-.48-.54-.65-.71l-4.86-4.84c-.39.25-.82.6-1.29,1.06-.47.46-.83.89-1.06,1.29l4.86,4.84c.17.17.4.4.69.67.21.2.36.34.51.49-.16.15-.31.29-.51.49-.29.28-.52.5-.69.67l-4.86,4.84c.23.4.58.84,1.06,1.3.47.47.9.81,1.29,1.05l4.86-4.84c.19-.17.41-.41.66-.71.19-.22.34-.37.49-.52.15.15.3.3.49.52.26.3.48.54.66.71l4.86,4.84c.4-.23.83-.58,1.29-1.05.46-.46.81-.9,1.06-1.3l-4.86-4.84c-.17-.17-.4-.4-.69-.67-.21-.2-.36-.34-.51-.49.16-.15.31-.29.51-.49.29-.28.52-.5.69-.67Z" />
                            </svg>
                        </button>

                        {/* Arte del ecualizador SVG — usa la imagen principal del artículo */}
                        {mp3 && imagenUrl && (
                            <div className="player-art">
                                <svg className="wave-mask" viewBox="0 0 350 350" role="img" aria-label="Equalizer bars animation">
                                    <defs>
                                        <rect id="bar" x="0" y="50" width="6" height="260" rx="3" ry="3" />
                                        <mask id="barsMask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                                            <g id="eq" className="paused">
                                                {Array.from({ length: 34 }, (_, i) => (
                                                    <use key={i} href="#bar" x={i * 10} style={{ "--i": i }} />
                                                ))}
                                            </g>
                                        </mask>
                                    </defs>
                                    <image
                                        href={imagenUrl}
                                        x="0" y="0" width="350" height="350"
                                        preserveAspectRatio="xMidYMid slice"
                                        mask="url(#barsMask)"
                                    />
                                </svg>
                                <img className="mask-back" src={imagenUrl} alt="" aria-hidden="true" />
                            </div>
                        )}

                        {/* Info y título de audio */}
                        <div className="audio-info">
                            <h3 className="audio-title show">
                                <span
                                    className="marquee-content"
                                    data-text={`${titulo}${subtitulo ? ` | ${subtitulo}` : ""}`}
                                >
                                    {titulo}{subtitulo ? ` | ${subtitulo}` : ""}
                                </span>
                            </h3>
                            <p className="audio-description">Escucha este artículo:</p>
                        </div>

                        {/* Controles del player */}
                        <div className="audio-container">
                            <div className="audio-player" id="audioPlayer">

                                <button
                                    className="prev"
                                    id="prevButton"
                                    {...(prevArticle ? { "data-prev-article": prevArticle } : {})}
                                    aria-label="Artículo anterior"
                                >
                                    <img src="/img/prev.svg" alt="" />
                                </button>

                                <button
                                    className="play-button"
                                    id="playButton"
                                    data-eq-toggle="#eq"
                                    aria-label="Reproducir / Pausar"
                                >
                                    <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.68 15.09">
                                        <g>
                                            <path className="svg-color-inverse" d="M16.24,6.86L1.05.07C.56-.16,0,.21,0,.75v13.6c0,.54.56.9,1.05.68l15.19-6.8c.59-.26.59-1.1,0-1.36Z" />
                                        </g>
                                    </svg>
                                </button>

                                <button
                                    className="next"
                                    id="nextButton"
                                    {...(nextArticle ? { "data-next-article": nextArticle } : {})}
                                    aria-label="Artículo siguiente"
                                >
                                    <img src="/img/next.svg" alt="" />
                                </button>

                                <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        id="progressBar"
                                        role="slider"
                                        tabIndex={0}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={0}
                                    >
                                        <div className="progress-fill" id="progressFill"></div>
                                        <div className="progress-handle" id="progressHandle"></div>
                                    </div>
                                </div>

                                <div className="time-display" id="timeDisplay">0:00 / 0:00</div>

                                <div className="volume-container">
                                    <button className="volume-button" id="volumeButton" aria-label="Volumen">&nbsp;</button>
                                    <input
                                        type="range"
                                        className="volume-slider"
                                        id="volumeSlider"
                                        min="0"
                                        max="100"
                                        defaultValue="100"
                                        aria-label="Control de volumen"
                                    />
                                </div>
                            </div>

                            {/* Audio element */}
                            {mp3 && (
                                <audio id="article-voice" preload="metadata">
                                    <source src={mp3} type="audio/mpeg" />
                                    Su navegador no soporta el elemento de <code>audio</code>.
                                </audio>
                            )}

                            {/* Botón de opciones (⋮) */}
                            <button className="option-dots" aria-label="Opciones">
                                <svg id="dots" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27">
                                    <circle fill="#82786f" cx="13.5" cy="5.91" r="1.96" />
                                    <circle fill="#82786f" cx="13.5" cy="13.76" r="1.96" />
                                    <circle fill="#82786f" cx="13.5" cy="21.61" r="1.96" />
                                </svg>
                                <svg id="option-dots-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27">
                                    <path fill="#82786f" d="M17,12.34l4.86-4.84c-.25-.4-.6-.84-1.06-1.3-.46-.47-.89-.81-1.29-1.05l-4.86,4.84c-.17.17-.39.41-.65.71-.2.22-.35.37-.5.53-.15-.15-.31-.3-.5-.53-.26-.3-.48-.54-.65-.71l-4.86-4.84c-.39.25-.82.6-1.29,1.06-.47.46-.83.89-1.06,1.29l4.86,4.84c.17.17.4.4.69.67.21.2.36.34.51.49-.16.15-.31.29-.51.49-.29.28-.52.5-.69.67l-4.86,4.84c.23.4.58.84,1.06,1.3.47.47.9.81,1.29,1.05l4.86-4.84c.19-.17.41-.41.66-.71.19-.22.34-.37.49-.52.15.15.3.3.49.52.26.3.48.54.66.71l4.86,4.84c.4-.23.83-.58,1.29-1.05.46-.46.81-.9,1.06-1.3l-4.86-4.84c-.17-.17-.4-.4-.69-.67-.21-.2-.36-.34-.51-.49.16-.15.31-.29.51-.49.29-.28.52-.5.69-.67Z" />
                                </svg>
                            </button>
                        </div>

                        {/* Botones compartir / descargar */}
                        <div className="options">
                            <button className="share tooltip-css" aria-label="Compartir artículo" data-tooltip="Compartir artículo">
                                <svg id="share" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.69 18.04">
                                    <g><path d="M1.27,18.04c-.4,0-.71-.11-.94-.33-.23-.22-.34-.53-.34-.93V7.9c.15-.04.29-.07.44-.08.14-.01.31-.02.5-.02s.34,0,.48.03c.14.02.28.04.43.08v8.05c0,.15,0,.31-.03.48.17-.02.33-.03.48-.03h13.1c.15,0,.31,0,.47.03,0-.17-.02-.33-.02-.48s0-.3,0-.46v-7.59c.15-.04.29-.07.44-.08.14-.01.31-.02.49-.02.19,0,.36,0,.5.03.14.02.28.04.42.08v8.88c0,.4-.11.71-.33.93-.22.22-.53.33-.93.33H1.27ZM8.84,11.91c-.14,0-.3-.01-.48-.03-.18-.02-.33-.05-.44-.07V3.74c0-.16,0-.33,0-.53,0-.2.01-.4.02-.61-.19.26-.39.51-.6.74-.21.23-.43.47-.64.7l-1.25,1.36c-.24-.16-.49-.36-.73-.59-.25-.23-.44-.46-.59-.68L8.15.1c.17-.07.4-.1.69-.1s.5.03.68.1l4.03,4.03c-.14.23-.33.45-.58.68-.25.23-.5.43-.75.59l-1.25-1.36c-.22-.23-.43-.47-.64-.7s-.41-.48-.6-.74c.02.21.03.41.03.61v8.59c-.11.03-.26.05-.44.07-.18.02-.34.03-.48.03Z" /></g>
                                </svg>
                                <svg id="share-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 27">
                                    <path fill="#82786f" d="M17,12.34l4.86-4.84c-.25-.4-.6-.84-1.06-1.3-.46-.47-.89-.81-1.29-1.05l-4.86,4.84c-.17.17-.39.41-.65.71-.2.22-.35.37-.5.53-.15-.15-.31-.3-.5-.53-.26-.3-.48-.54-.65-.71l-4.86-4.84c-.39.25-.82.6-1.29,1.06-.47.46-.83.89-1.06,1.29l4.86,4.84c.17.17.4.4.69.67.21.2.36.34.51.49-.16.15-.31.29-.51.49-.29.28-.52.5-.69.67l-4.86,4.84c.23.4.58.84,1.06,1.3.47.47.9.81,1.29,1.05l4.86-4.84c.19-.17.41-.41.66-.71.19-.22.34-.37.49-.52.15.15.3.3.49.52.26.3.48.54.66.71l4.86,4.84c.4-.23.83-.58,1.29-1.05.46-.46.81-.9,1.06-1.3l-4.86-4.84c-.17-.17-.4-.4-.69-.67-.21-.2-.36-.34-.51-.49.16-.15.31-.29.51-.49.29-.28.52-.5.69-.67Z" />
                                </svg>
                            </button>

                            <button className="download tooltip-css" aria-label="Descargar artículo" data-tooltip="Descargar artículo">
                                <svg id="download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.9 18.04">
                                    <g><path d="M.1,18.04c-.07-.26-.1-.53-.1-.82,0-.13.01-.28.03-.44.02-.16.05-.29.07-.38h17.69c.03.1.05.22.07.38s.03.31.03.44c0,.12-.01.26-.03.43-.02.17-.05.29-.07.39H.1ZM8.94,14.95c-.28,0-.5-.03-.68-.1L1.66,8.24c.15-.23.34-.46.59-.69.25-.23.49-.42.73-.58l3.82,3.94c.23.23.44.46.65.7s.41.49.6.75c0-.22-.02-.42-.03-.62,0-.19-.01-.37-.01-.54V.1c.12-.03.27-.05.45-.07.18-.02.34-.03.47-.03s.3.01.48.03c.18.02.33.05.44.07v11.63c0,.19,0,.4-.03.62.2-.26.4-.51.61-.75.21-.24.42-.47.64-.69l3.82-3.94c.24.17.49.36.73.58.25.23.44.46.59.69l-6.6,6.6c-.17.07-.4.1-.69.1Z" /></g>
                                </svg>
                            </button>

                            {/* Share bar */}
                            <div className="share-bar" aria-label="Compartir este artículo">
                                <a className="share-btn fb" href="#" target="_blank" rel="noopener" aria-label="Compartir en Facebook">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                                    </svg>
                                </a>
                                <a className="share-btn li" href="#" target="_blank" rel="noopener" aria-label="Compartir en LinkedIn">
                                    <img src="/img/share-linkedin.svg" alt="LinkedIn" />
                                </a>
                                <a className="share-btn x" href="#" target="_blank" rel="noopener" aria-label="Compartir en X">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                    </svg>
                                </a>
                                <a className="share-btn mail" href="#" aria-label="Compartir por correo">
                                    <img src="/img/share-mail.svg" alt="Email" />
                                </a>
                                <button id="native-share" className="share-btn native" type="button" aria-label="Enviar">
                                    <img src="/img/share-forward.svg" alt="" />
                                </button>
                                <button id="copy-link" className="share-btn copy" type="button" aria-label="Copiar enlace">
                                    <img src="/img/share-link.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ── FIN PLAYER ────────────────────────────────────── */}

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

            {/* Toast */}
            <div id="toast" className="toast"></div>

            {/* Botón "arriba" */}
            <button className="scroll-to-top" id="scrollToTopBtn" aria-label="Scroll to top">
                <img src="/img/up.svg" alt="" />
            </button>

            {/* Toda la interactividad del lado cliente */}
            <ArticleInteractions
                audioSrc={mp3}
                prevArticle={prevArticle}
                nextArticle={nextArticle}
            />
        </div>
    );
}
