// src/app/components/PostLayoutv2.jsx
"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { STRAPI_URL } from "@/lib/api";

const BASE = STRAPI_URL ?? "http://localhost:1337";

function slugify(text = "") {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
}

function extractH3(nodes = []) {
    if (!Array.isArray(nodes)) return [];
    const items = [];
    for (const node of nodes) {
        if (node?.type === "heading" && Number(node.level) === 3) {
            const text = (node.children || [])
                .map((c) => c?.text || "")
                .join("")
                .trim();
            if (text) items.push({ id: slugify(text), text });
        }
    }
    // Agregar la sección "Referencias" manualmente al final del índice
    items.push({ id: "sub-referencias", text: "Referencias" });
    return items;
}

function RichContent({ nodes = [] }) {
    if (!Array.isArray(nodes)) return null;

    return nodes.map((node, idx) => {
        switch (node.type) {
            case "heading": {
                const level = Number(node.level) || 3;
                const textContent = (node.children || [])
                    .map((c) => c.text)
                    .join("")
                    .trim();

                if (level === 1) return <h1 key={idx} className="article-title">{textContent}</h1>;
                if (level === 2) return <h2 key={idx} className="article-subtitle">{textContent}</h2>;
                if (level === 3) return (
                    <h3 key={idx} id={slugify(textContent)} className="article-subtitles">
                        {textContent}
                    </h3>
                );
                return <h4 key={idx}>{textContent}</h4>;
            }

            case "paragraph": {
                const isEmpty =
                    !node.children || node.children.every((c) => !c.text || c.text.trim() === "");
                if (isEmpty) return <br key={idx} />;

                return (
                    <p key={idx}>
                        {(node.children || []).map((c, i) => (
                            <span key={i} className={c.bold ? "font-bold" : ""}>
                                {c.text}
                            </span>
                        ))}
                    </p>
                );
            }

            case "quote": {
                const text = (node.children || []).map((c) => c.text).join(" ");
                return (
                    <blockquote key={idx} className="callout">
                        {text}
                    </blockquote>
                );
            }

            case "image": {
                const src =
                    node?.image?.formats?.large?.url ||
                    node?.image?.url ||
                    null;
                if (!src) return null;

                const absolute = src.startsWith("http") ? src : `${BASE}${src}`;
                const caption = node?.image?.caption || node?.image?.alternativeText || "";

                return (
                    <figure key={idx}>
                        <div className="gradient" />
                        <img className="landscape" src={absolute} alt={caption || "imagen"} />
                        {caption && <figcaption>{caption}</figcaption>}
                    </figure>
                );
            }

            default:
                return null;
        }
    });
}

/* ─────────────────────────────────────────────
   AudioPlayer interactivo (client-side)
───────────────────────────────────────────── */
function AudioPlayer({ audioUrl, titulo }) {
    const audioRef = useRef(null);
    const progressFillRef = useRef(null);
    const progressHandleRef = useRef(null);
    const timeDisplayRef = useRef(null);
    const playBtnRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const playBtn = playBtnRef.current;
        const fill = progressFillRef.current;
        const handle = progressHandleRef.current;
        const timeDisplay = timeDisplayRef.current;

        function formatTime(s) {
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${m}:${sec.toString().padStart(2, "0")}`;
        }

        const onTimeUpdate = () => {
            const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
            if (fill) fill.style.width = `${pct}%`;
            if (handle) handle.style.left = `${pct}%`;
            if (timeDisplay)
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
        };

        const onPlay = () => playBtn?.classList.add("playing");
        const onPause = () => playBtn?.classList.remove("playing");

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);

        playBtn?.addEventListener("click", () => {
            audio.paused ? audio.play() : audio.pause();
        });

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
        };
    }, [audioUrl]);

    return (
        <div className="article-media">
            <div className="audio-info">
                <h3 className="audio-title">
                    <span className="marquee-content" data-text={titulo}>{titulo}</span>
                </h3>
                <p className="audio-description">Escucha este artículo:</p>
            </div>

            <div className="audio-container">
                <div className="audio-player" id="audioPlayer">
                    <button className="play-button" id="playButton" ref={playBtnRef} aria-label="Reproducir/Pausar">
                        <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.68 15.09">
                            <g>
                                <path className="svg-color-inverse"
                                      d="M16.24,6.86L1.05.07C.56-.16,0,.21,0,.75v13.6c0,.54.56.9,1.05.68l15.19-6.8c.59-.26.59-1.1,0-1.36Z"/>
                            </g>
                        </svg>
                    </button>

                    <div className="progress-container">
                        <div className="progress-bar" id="progressBar">
                            <div className="progress-fill" id="progressFill" ref={progressFillRef}></div>
                            <div className="progress-handle" id="progressHandle" ref={progressHandleRef}></div>
                        </div>
                    </div>

                    <div className="time-display" id="timeDisplay" ref={timeDisplayRef}>
                        0:00 / 0:00
                    </div>

                    <audio id="article-voice" ref={audioRef} preload="metadata">
                        <source src={audioUrl} type="audio/mpeg" />
                        Su navegador no soporta el elemento de <code>audio</code>.
                    </audio>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Barra de compartir
───────────────────────────────────────────── */
function ShareBar({ titulo, url }) {
    const encoded = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(titulo || "");

    return (
        <div className="share-bar" aria-label="Compartir este artículo">
            <a className="share-btn fb"
               href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
               target="_blank" rel="noopener" aria-label="Compartir en Facebook">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
                     viewBox="0 0 320 512" className="h-6 w-6 text-gray-900" height="1em" width="1em"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
            </a>

            <a className="share-btn li"
               href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
               target="_blank" rel="noopener" aria-label="Compartir en LinkedIn">
                <img src="/img/share-linkedin.svg" alt="LinkedIn" />
            </a>

            <a className="share-btn x"
               href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
               target="_blank" rel="noopener" aria-label="Compartir en X (Twitter)">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
                     viewBox="0 0 512 512" className="h-6 w-6 text-gray-900" height="1em" width="1em"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                </svg>
            </a>

            <a className="share-btn mail"
               href={`mailto:?subject=${encodedTitle}&body=${encoded}`}
               aria-label="Compartir por correo">
                <img src="/img/share-mail.svg" alt="Correo" />
            </a>

            <button id="copy-link" className="share-btn copy" type="button"
                    onClick={() => navigator.clipboard?.writeText(url)}>
                <img src="/img/share-link.svg" alt="Copiar enlace" />
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
export default function PostLayout({ post, pageUrl }) {
    const {
        titulo,
        subtitulo,
        contenido,
        Autor_de_articulo: autor,
        imagen,
        audio,
        Referencias: referencias = [],
        pdfdescargable,
        revista,
    } = post || {};

    // ── Imagen del autor ──────────────────────────────────────────────
    const fotoAutorUrl = autor?.foto_de_autor?.formats?.medium?.url
        ? `${BASE}${autor.foto_de_autor.formats.medium.url}`
        : autor?.foto_de_autor?.url
            ? `${BASE}${autor.foto_de_autor.url}`
            : "/img/autor.jpg";

    // ── Imagen hero del artículo ──────────────────────────────────────
    const imageUrl =
        imagen?.[0]?.formats?.large?.url
            ? `${BASE}${imagen[0].formats.large.url}`
            : imagen?.[0]?.url
                ? `${BASE}${imagen[0].url}`
                : null;

    // ── Audio (media en Strapi) ───────────────────────────────────────
    const audioFile = Array.isArray(audio) ? audio[0] : audio ?? null;
    const audioUrl = audioFile?.url
        ? audioFile.url.startsWith("http") ? audioFile.url : `${BASE}${audioFile.url}`
        : null;

    // ── PDF descargable ───────────────────────────────────────────────
    const pdfUrl = pdfdescargable?.url
        ? pdfdescargable.url.startsWith("http") ? pdfdescargable.url : `${BASE}${pdfdescargable.url}`
        : null;

    // ── Índice de secciones (H3) ──────────────────────────────────────
    const subheadings = extractH3(contenido);

    // ── Datos de la revista (para upper-info) ─────────────────────────
    const revistaNumero = revista?.numero ?? null;
    const revistaTema   = revista?.tema   ?? null;

    // ── URL para compartir ────────────────────────────────────────────
    const shareUrl = pageUrl || (typeof window !== "undefined" ? window.location.href : "");

    return (
        <div className="bg-white text-gray-900">
            <div id="revista-container" className="container max-w-7xl mx-auto px-4">
                <main id="content" className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-10">

                    {/* ── Sidebar: autor + PDF + índice ── */}
                    <aside id="nav-content" className="lg:col-span-1 space-y-6">

                        {/* Autor */}
                        {autor && (
                            <section className="article-author mt-8 p-4 border-t">
                                <h4 className="author text-lg font-bold">
                                    {autor.nombre_de_autor}
                                </h4>
                                <div className="author-abstract flex items-center gap-4 mt-4">
                                    <img
                                        src={fotoAutorUrl}
                                        alt={`Foto de ${autor.nombre_de_autor}`}
                                        width={120}
                                        height={120}
                                        className="rounded-full object-cover"
                                    />
                                    {autor.semblanza_autor && (
                                        <span className="text-sm text-gray-600">
                                            {autor.semblanza_autor}
                                        </span>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* PDF descargable */}
                        {pdfUrl && (
                            <section className="article-pdf mt-8 p-4 border-t">
                                <div className="flex items-center gap-4">
                                    <a
                                        href={pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                        download
                                    >
                                        Descargar PDF
                                    </a>
                                </div>
                            </section>
                        )}

                        {/* Índice */}
                        {subheadings.length > 0 && (
                            <section className="article-navigation">
                                <h6>en este artículo</h6>
                                <ul>
                                    {subheadings.map((s) => (
                                        <li key={s.id}>
                                            <a href={`#${s.id}`}>{s.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </aside>

                    {/* ── Contenido principal ── */}
                    <article className="ibero lg:col-span-3">

                        {/* Upper info: número y tema de la revista */}
                        <div className="upper-info">
                            <p className="revista-title">
                                {revistaNumero && <span>número {revistaNumero}</span>}
                                {revistaNumero && revistaTema && " | "}
                                {revistaTema}
                            </p>
                        </div>

                        {/* Títulos del artículo */}
                        <div className="headings">
                            <h1 className="article-title">{titulo}</h1>
                            {subtitulo && <h2 className="article-subtitle">{subtitulo}</h2>}
                        </div>

                        {/* Audio player */}
                        {audioUrl && (
                            <AudioPlayer audioUrl={audioUrl} titulo={titulo} />
                        )}

                        {/* Opciones: compartir y descargar */}
                        {audioUrl && (
                            <div className="options">
                                <button className="share tooltip-css" aria-label="share"
                                        data-tooltip="Compartir artículo"
                                        onClick={(e) => e.currentTarget.closest(".article-media")?.querySelector(".share-bar")?.classList.toggle("active")}>
                                    <svg id="share" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.69 18.04">
                                        <g>
                                            <path
                                                d="M1.27,18.04c-.4,0-.71-.11-.94-.33-.23-.22-.34-.53-.34-.93V7.9c.15-.04.29-.07.44-.08.14-.01.31-.02.5-.02s.34,0,.48.03c.14.02.28.04.43.08v8.05c0,.15,0,.31-.03.48.17-.02.33-.03.48-.03h13.1c.15,0,.31,0,.47.03,0-.17-.02-.33-.02-.48s0-.3,0-.46v-7.59c.15-.04.29-.07.44-.08.14-.01.31-.02.49-.02.19,0,.36,0,.5.03.14.02.28.04.42.08v8.88c0,.4-.11.71-.33.93-.22.22-.53.33-.93.33H1.27ZM8.84,11.91c-.14,0-.3-.01-.48-.03-.18-.02-.33-.05-.44-.07V3.74c0-.16,0-.33,0-.53,0-.2.01-.4.02-.61-.19.26-.39.51-.6.74-.21.23-.43.47-.64.7l-1.25,1.36c-.24-.16-.49-.36-.73-.59-.25-.23-.44-.46-.59-.68L8.15.1c.17-.07.4-.1.69-.1s.5.03.68.1l4.03,4.03c-.14.23-.33.45-.58.68-.25.23-.5.43-.75.59l-1.25-1.36c-.22-.23-.43-.47-.64-.7s-.41-.48-.6-.74c.02.21.03.41.03.61v8.59c-.11.03-.26.05-.44.07-.18.02-.34.03-.48.03Z"/>
                                        </g>
                                    </svg>
                                </button>

                                {pdfUrl && (
                                    <button className="download tooltip-css" aria-label="download"
                                            data-tooltip="Descargar artículo"
                                            onClick={() => window.open(pdfUrl, "_blank")}>
                                        <svg id="download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.9 18.04">
                                            <g>
                                                <path
                                                    d="M.1,18.04c-.07-.26-.1-.53-.1-.82,0-.13.01-.28.03-.44.02-.16.05-.29.07-.38h17.69c.03.1.05.22.07.38s.03.31.03.44c0,.12-.01.26-.03.43-.02.17-.05.29-.07.39H.1ZM8.94,14.95c-.28,0-.5-.03-.68-.1L1.66,8.24c.15-.23.34-.46.59-.69.25-.23.49-.42.73-.58l3.82,3.94c.23.23.44.46.65.7s.41.49.6.75c0-.22-.02-.42-.03-.62,0-.19-.01-.37-.01-.54V.1c.12-.03.27-.05.45-.07.18-.02.34-.03.47-.03s.3.01.48.03c.18.02.33.05.44.07v11.63c0,.19,0,.4-.03.62.2-.26.4-.51.61-.75.21-.24.42-.47.64-.69l3.82-3.94c.24.17.49.36.73.58.25.23.44.46.59.69l-6.6,6.6c-.17.07-.4.1-.69.1Z"/>
                                            </g>
                                        </svg>
                                    </button>
                                )}

                                <ShareBar titulo={titulo} url={shareUrl} />
                            </div>
                        )}

                        {/* Cuerpo del artículo */}
                        <div className="article-content">
                            <RichContent nodes={contenido} />
                        </div>

                        {/* Referencias */}
                        {Array.isArray(referencias) && referencias.length > 0 && (
                            <blockquote className="article-references">
                                <h3 className="article-references-title" id="sub-referencias">
                                    Referencias
                                </h3>
                                <ul>
                                    {referencias
                                        .filter((r) => r.autor_referencia || r.obra || r.url)
                                        .map((r, i) => (
                                            <li key={r.id ?? i}>
                                                {[r.autor_referencia, r.obra].filter(Boolean).join(", ")}
                                                {r.url && (
                                                    <>. <a href={r.url} target="_blank" rel="noreferrer">consultar</a></>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </blockquote>
                        )}
                    </article>
                </main>
            </div>
        </div>
    );
}