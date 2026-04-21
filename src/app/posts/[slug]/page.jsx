// src/app/posts/[slug]/page.jsx
import qs from "qs";
import PostLayout from "@/app/components/PostLayoutv2";

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

    // Strapi v5 ya devuelve los datos "aplanados" (sin .attributes)
    // Si tu versión usa attributes, la línea siguiente los aplana:
    const post = item.attributes ?? item;

    // ── Normalizar imagen (puede venir como array o como objeto con .data) ──
    const mediaData = post.imagen?.data ?? post.imagen;
    post.imagen = Array.isArray(mediaData)
        ? mediaData.map((m) => m.attributes ?? m)
        : mediaData?.attributes
            ? [mediaData.attributes]
            : mediaData
                ? [mediaData]
                : [];

    // ── Normalizar audio (media field) ──
    // PostLayoutv2 espera post.audio como array de objetos con .url
    const audioData = post.audio?.data ?? post.audio;
    post.audio = Array.isArray(audioData)
        ? audioData.map((m) => m.attributes ?? m)
        : audioData?.attributes
            ? [audioData.attributes]
            : audioData
                ? [audioData]
                : [];

    // ── Normalizar Autor_de_articulo ──
    // El componente Strapi puede venir nested bajo .data o directo
    if (post.Autor_de_articulo) {
        const autorRaw = post.Autor_de_articulo?.data ?? post.Autor_de_articulo;
        const autorAttrs = autorRaw?.attributes ?? autorRaw;
        // Normalizar foto_de_autor dentro del autor
        if (autorAttrs?.foto_de_autor) {
            const fotoData = autorAttrs.foto_de_autor?.data ?? autorAttrs.foto_de_autor;
            autorAttrs.foto_de_autor = fotoData?.attributes ?? fotoData;
        }
        post.Autor_de_articulo = autorAttrs;
    }

    // ── Normalizar pdfdescargable ──
    if (post.pdfdescargable?.data ?? post.pdfdescargable) {
        const pdfData = post.pdfdescargable?.data ?? post.pdfdescargable;
        post.pdfdescargable = pdfData?.attributes ?? pdfData;
    }

    // ── Normalizar revista (para numero y tema) ──
    if (post.revista) {
        const revistaData = post.revista?.data ?? post.revista;
        post.revista = revistaData?.attributes ?? revistaData;
    }

    // ── URL de la página para compartir ──
    const pageUrl = `${SITE_URL}/posts/${slug}`;

    return <PostLayout post={post} pageUrl={pageUrl} />;
}