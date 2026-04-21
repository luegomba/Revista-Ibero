// src/app/components/PostLayoutv2.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

// Utilidad pequeña para IDs slug en headings (ya la usabas)
const slugify = (str) =>
    (str || "")
        .toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

export default function PostLayout({ post }) {
    const {
        titulo,
        subtitulo,
        contenido = [],
        autor = {},
        imagen = [],
        fecha,
        audioUrl,
        referencias = [],
    } = post || {};

    // Índice lateral (h3 del rich text)
    const headings = useMemo(() => {
        if (!Array.isArray(contenido)) return [];
        return contenido
            .filter((n) => n.type === "heading" && (n.level === 3 || n.level === "3"))
            .map((n) => {
                const text = n.children?.map((c) => c.text).join("") || "";
                return { text, id: slugify(text) };
            });
    }, [contenido]);

    // Inyectar id en headings al render
    const renderNode = (node, idx) => {
        if (node.type === "heading") {
            const text = node.children?.map((c) => c.text).join("") || "";
            const id = slugify(text);
            const level = Number(node.level) || 3;
            if (level === 3) {
                return (
                    <h3 key={idx} id={id} className="article-subheading">
                        {text}
                    </h3>
                );
            }
            // Otros niveles si los llegas a usar
            const Tag = `h${Math.min(Math.max(level, 2), 4)}`;
            return <Tag key={idx}>{text}</Tag>;
        }

        if (node.type === "paragraph") {
            const text = node.children?.map((c) => c.text).join("") || "";
            return <p key={idx} className="p">{text}</p>;
        }

        if (node.type === "quote") {
            const text = node.children?.map((c) => c.text).join("") || "";
            return (
                <blockquote key={idx} className="article-quote">
                    {text}
                </blockquote>
            );
        }

        if (node.type === "image" && node.image?.url) {
            const url = node.image.url.startsWith("http")
                ? node.image.url
                : `http://localhost:1337${node.image.url}`;
            return (
                <figure key={idx} className="my-8">
                    {/* Para imágenes externas asegúrate que el dominio esté en next.config.js */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={node.image.alternativeText || ""} className="w-full rounded-lg" />
                    {node.image.caption ? (
                        <figcaption className="text-sm text-gray-500 mt-2">{node.image.caption}</figcaption>
                    ) : null}
                </figure>
            );
        }

        return null;
    };

    // Imagen destacada (si la quieres mostrar además del rich text)
    const portada = imagen?.[0];
    const portadaUrl = portada?.formats?.medium?.url
        ? `http://localhost:1337${portada.formats.medium.url}`
        : portada?.url
            ? (portada.url.startsWith("http") ? portada.url : `http://localhost:1337${portada.url}`)
            : null;

    return (
        <div className="bg-white text-gray-900">
            {/* Header simple */}
            <header className="bg-black text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-semibold">Revista de la Universidad Iberoamericana</h1>
                    <nav className="space-x-6 text-sm">
                        <a href="/">Número actual</a>
                        <a href="/revistas">Números anteriores</a>
                        <a href="#">Directorio</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Índice lateral */}
                <aside className="lg:col-span-1 space-y-6">
                    {headings.length > 0 && (
                        <nav className="bg-gray-50 p-4 rounded">
                            <h3 className="text-sm font-bold mb-2">En este artículo</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {headings.map((h) => (
                                    <li key={h.id}>
                                        <a href={`#${h.id}`} className="text-black hover:underline">{h.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {/* Autor (desde componente Autor_de_articulo) */}
                    <section className="article-author">
                        <h4 className="author">{autor?.nombre || "Autor/a"}</h4>
                        <p className="author-abstract">
                            {/* Si más adelante agregas foto en el componente, aquí la cargas */}
                            <Image
                                src="/autor.jpg"
                                alt={autor?.nombre || "Autor/a"}
                                width={240}
                                height={240}
                            />
                            {autor?.bio || "Bio / cargo del autor"}
                        </p>
                    </section>

                </aside>

                {/* Contenido */}
                <article className="lg:col-span-3 space-y-6">
                    <p className="text-sm uppercase tracking-wide text-gray-500">
                        {/* Ej: NÚMERO 96 | IA EN LA EDUCACIÓN */}
                    </p>

                    <h1 className="article-title">{titulo}</h1>
                    {subtitulo ? <h2 className="article-subtitle">{subtitulo}</h2> : null}
                    {fecha ? <p className="text-xs text-gray-500">{post.fecha}</p> : null}

                    {/* Audio (si existe) */}
                    {audioUrl ? (
                        <div className="bg-gray-200 p-4 rounded flex items-center gap-4">
                            <audio controls src={audioUrl} className="w-full">
                                Tu navegador no soporta el elemento audio.
                            </audio>
                        </div>
                    ) : null}

                    {/* Imagen destacada opcional */}
                    {portadaUrl && (
                        <Image
                            src={portadaUrl}
                            alt={titulo}
                            width={1200}
                            height={630}
                            className="rounded-lg w-full h-auto"
                        />
                    )}

                    {/* Rich text */}
                    <div className="article-body">
                        {Array.isArray(contenido) ? contenido.map((n, i) => renderNode(n, i)) : null}
                    </div>

                    {/* Referencias */}
                    <section className="mt-12">
                        <h3  className="article-references-title" id="sub-3">Referencias</h3>
                        <ul className="text-sm space-y-2">
                            {referencias.length > 0 ? (
                                referencias.map((ref, idx) => (
                                    <li key={idx}>
                                        {ref.autor && <span className="font-medium">{ref.autor}</span>}{" "}
                                        {ref.obra && <em>{ref.obra}</em>}{" "}
                                        {ref.url && (
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                [Enlace]
                                            </a>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li>No hay referencias disponibles</li>
                            )}
                        </ul>
                    </section>
                </article>
            </main>

            <footer className="bg-gray-100 text-gray-600 text-sm py-6 mt-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>IBERO | Prolongación Paseo de la Reforma 880, Ciudad de México</p>
                    <div className="mt-2 flex justify-center space-x-4">
                        <a href="#">Twitter</a>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
