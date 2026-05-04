// src/app/posts/[slug]/page.jsx
import qs from "qs";
import ArticuloInterior from "@/app/components/ArticuloInterior";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { slug } = params;
    const query = qs.stringify(
        { filters: { slug: { $eq: slug } }, fields: ["titulo", "subtitulo"] },
        { encodeValuesOnly: true }
    );
    try {
        const res = await fetch(`${API_BASE}/api/posts?${query}`, { cache: "no-store" });
        const json = await res.json();
        const item = json?.data?.[0] ?? {};
        const a = item.attributes ?? item;
        return {
            title: a.titulo ? `${a.titulo} | Revista IBERO` : "Revista IBERO",
            description: a.subtitulo || "Revista de la Universidad Iberoamericana",
        };
    } catch {
        return { title: "Revista IBERO" };
    }
}

export default async function PostPage({ params }) {
    const { slug } = params;

    // portada_thumb no existe como campo en Strapi — se omite del populate
    const query = qs.stringify(
        {
            filters: { slug: { $eq: slug } },
            populate: {
                imagen: true,
                audio: true,
                Referencias: true,
                Autor_de_articulo: {
                    populate: ["foto_de_autor"],
                },
                pdfdescargable: true,
                revista: {
                    fields: ["numero", "tema", "titulo", "slug"],
                    populate: ["portada"],
                },
            },
        },
        { encodeValuesOnly: true }
    );

    const url = `${API_BASE}/api/posts?${query}`;
    let res;

    try {
        res = await fetch(url, { cache: "no-store" });
    } catch {
        return <div className="p-6 text-red-600">No se pudo conectar a Strapi.</div>;
    }

    if (!res.ok) {
        const msg = res.status === 404 ? "Artículo no encontrado." : `Error ${res.status}: ${res.statusText}`;
        return <div className="p-6 text-red-600">{msg}</div>;
    }

    const json = await res.json();
    const item = json?.data?.[0];
    if (!item) return <div className="p-6">Artículo no encontrado.</div>;

    // Strapi v5: datos ya planos (sin .attributes)
    const post = item.attributes ?? item;

    // ── Normalizar imagen ──
    const imgRaw = post.imagen;
    post.imagen = (Array.isArray(imgRaw) ? imgRaw : imgRaw ? [imgRaw] : [])
        .map((m) => m.attributes ?? m);

    // ── Normalizar audio ──
    const audioRaw = post.audio;
    post.audio = (Array.isArray(audioRaw) ? audioRaw : audioRaw ? [audioRaw] : [])
        .map((m) => m.attributes ?? m);

    // ── Normalizar Autor_de_articulo ──
    // Strapi v5: viene como objeto directo
    if (post.Autor_de_articulo) {
        const autorRaw = post.Autor_de_articulo?.data ?? post.Autor_de_articulo;
        const autorAttrs = autorRaw?.attributes ?? autorRaw;
        if (autorAttrs?.foto_de_autor) {
            const fotoRaw = autorAttrs.foto_de_autor?.data ?? autorAttrs.foto_de_autor;
            autorAttrs.foto_de_autor = fotoRaw?.attributes ?? fotoRaw;
        }
        post.Autor_de_articulo = autorAttrs;
    }

    // ── Normalizar revista ──
    if (post.revista) {
        const revistaRaw = post.revista?.data ?? post.revista;
        post.revista = revistaRaw?.attributes ?? revistaRaw;
    }

    // ── Extraer secciones (H3) del contenido richtext para el índice ──
    const secciones = Array.isArray(post.contenido)
        ? post.contenido
            .filter((n) => n?.type === "heading" && Number(n.level) === 3)
            .map((n) => {
                const text = (n.children || []).map((c) => c?.text || "").join("").trim();
                const id = text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
                return { id, label: text };
            })
        : [];

    // ── Convertir contenido richtext a HTML ──
    const BASE_URL = process.env.NEXT_PUBLIC_API_FILES_BASE || "http://localhost:1337";
    function richtextToHtml(nodes = []) {
        if (!Array.isArray(nodes)) return "";
        return nodes.map((node) => {
            const children = (node.children || [])
                .map((c) => {
                    if (c.type === "link" && c.url) {
                        const inner = (c.children || []).map((cc) => cc.text || "").join("");
                        return `<a href="${c.url}" target="_blank" rel="noreferrer">${inner}</a>`;
                    }
                    let text = c.text || "";
                    if (c.bold)      text = `<strong>${text}</strong>`;
                    if (c.italic)    text = `<em>${text}</em>`;
                    if (c.underline) text = `<u>${text}</u>`;
                    if (c.code)      text = `<code>${text}</code>`;
                    return text;
                })
                .join("");
            switch (node.type) {
                case "heading": {
                    const l = Number(node.level) || 3;
                    const id = children.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
                    return `<h${l} id="${id}">${children}</h${l}>`;
                }
                case "paragraph":
                    return children.trim() ? `<p>${children}</p>` : "<br/>";
                case "quote":
                    return `<blockquote class="callout">${children}</blockquote>`;
                case "list": {
                    const tag = node.format === "ordered" ? "ol" : "ul";
                    const items = (node.children || [])
                        .map((li) => {
                            const liText = (li.children || []).map((c) => c.text || "").join("");
                            return `<li>${liText}</li>`;
                        })
                        .join("");
                    return `<${tag}>${items}</${tag}>`;
                }
                case "image": {
                    const imgObj = node.image ?? node;
                    const src = imgObj?.formats?.large?.url || imgObj?.url || null;
                    if (!src) return "";
                    const abs = src.startsWith("http") ? src : `${BASE_URL}${src}`;
                    const cap = imgObj?.caption || imgObj?.alternativeText || "";
                    return `<figure><img class="landscape" src="${abs}" alt="${cap}" />${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`;
                }
                default:
                    return "";
            }
        }).join("\n");
    }

    // ── Mapear referencias ──
    const referencias = Array.isArray(post.Referencias)
        ? post.Referencias
            .filter((r) => r.autor_referencia || r.obra || r.url)
            .map((r) => ({
                texto: [r.autor_referencia, r.obra].filter(Boolean).join(", "),
                href: r.url || null,
            }))
        : [];

    // ── Etiqueta de revista ──
    const revistaNumero = post.revista?.numero ? `número ${post.revista.numero}` : null;
    const revistaTitulo = post.revista?.titulo ?? post.revista?.tema ?? null;

    // ── Portada de la revista ──
    const portadaRaw = post.revista?.portada;
    const portadaUrl = portadaRaw
        ? (() => {
            const url =
                portadaRaw.formats?.thumbnail?.url ||
                portadaRaw.formats?.medium?.url ||
                portadaRaw.url ||
                null;
            return url ? (url.startsWith("http") ? url : `${BASE_URL}${url}`) : null;
        })()
        : null;

    const audioFile = Array.isArray(post.audio) ? post.audio[0] : post.audio ?? null;
    const audioSrc = audioFile?.url
        ? audioFile.url.startsWith("http") ? audioFile.url : `${BASE_URL}${audioFile.url}`
        : null;

    // ── Imagen principal del artículo (para el player-art / ecualizador) ──
    const imgPrincipal = Array.isArray(post.imagen) ? post.imagen[0] : post.imagen ?? null;
    const imagenUrl = imgPrincipal
        ? (() => {
            const url =
                imgPrincipal.formats?.large?.url ||
                imgPrincipal.formats?.medium?.url ||
                imgPrincipal.url ||
                null;
            return url ? (url.startsWith("http") ? url : `${BASE_URL}${url}`) : null;
        })()
        : null;

    // ── Autor ──
    const autor = post.Autor_de_articulo;
    const autorFotoUrl = autor?.foto_de_autor?.formats?.medium?.url
        || autor?.foto_de_autor?.url
        || null;

    return (
        <ArticuloInterior
            revistaNumero={revistaNumero}
            revistaTitulo={revistaTitulo}
            portadaUrl={portadaUrl}
            titulo={post.titulo}
            subtitulo={post.subtitulo}
            autorNombre={autor?.nombre_de_autor}
            autorBio={autor?.semblanza_autor}
            autorFotoUrl={autorFotoUrl}
            imagenUrl={imagenUrl}
            audioSrc={audioSrc}
            secciones={secciones}
            htmlContenido={richtextToHtml(post.contenido)}
            referencias={referencias}
        />
    );
}