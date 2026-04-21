// src/app/components/RichContent.jsx
"use client";

import Image from "next/image";

// Renderiza spans con marcas (bold, italic, underline)
function renderTextLeaf(leaf, i) {
    let node = leaf.text ?? "";
    if (leaf.bold) node = <strong key={`b-${i}`}>{node}</strong>;
    if (leaf.italic) node = <em key={`i-${i}`}>{node}</em>;
    if (leaf.underline) node = <u key={`u-${i}`}>{node}</u>;
    return <>{node}</>;
}

function RichParagraph({ children }) {
    // Evita párrafos vacíos visualmente
    const isEmpty = children.every(
        (c) => typeof c === "string" ? c.trim() === "" : false
    );
    if (isEmpty) return null;
    return <p className="text-lg leading-relaxed">{children}</p>;
}

export default function RichContent({ content = [] }) {
    if (!Array.isArray(content)) return null;

    return (
        <div className="prose max-w-none">
            {content.map((block, idx) => {
                const children =
                    block.children?.map((leaf, i) => renderTextLeaf(leaf, i)) ?? [];

                switch (block.type) {
                    case "heading": {
                        const level = Math.min(Math.max(block.level || 3, 1), 6);
                        const Tag = `h${level}`;
                        // Puedes ajustar estilos por nivel si quieres
                        const cls =
                            level === 1
                                ? "text-4xl font-bold mt-8 mb-4"
                                : level === 2
                                    ? "text-3xl font-semibold mt-6 mb-3"
                                    : "text-2xl font-semibold mt-5 mb-3";
                        return (
                            <Tag key={idx} className={cls}>
                                {children}
                            </Tag>
                        );
                    }

                    case "quote":
                        return (
                            <blockquote
                                key={idx}
                                className="border-l-4 border-orange-500 pl-4 italic text-orange-700 text-xl my-8"
                            >
                                {children}
                            </blockquote>
                        );

                    case "image": {
                        const img = block.image;
                        if (!img?.url) return null;

                        // Usa el formato medium si existe; si no, el original
                        const src =
                            img.formats?.medium?.url
                                ? (img.formats.medium.url.startsWith("http")
                                    ? img.formats.medium.url
                                    : `http://localhost:1337${img.formats.medium.url}`)
                                : img.url;

                        const width = img.formats?.medium?.width || img.width || 800;
                        const height = img.formats?.medium?.height || img.height || 450;

                        return (
                            <figure key={idx} className="my-6">
                                <Image
                                    src={src}
                                    alt={img.alternativeText || img.name || "Imagen del artículo"}
                                    width={width}
                                    height={height}
                                    className="rounded-lg w-full h-auto object-cover"
                                />
                                {img.caption && (
                                    <figcaption className="text-sm text-gray-600 mt-2">
                                        {img.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    }

                    // párrafos (y tipos no mapeados que contengan texto)
                    case "paragraph":
                    default:
                        return (
                            <RichParagraph key={idx}>{children}</RichParagraph>
                        );
                }
            })}
        </div>
    );
}
