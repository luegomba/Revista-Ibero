"use client";
import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }) {
    if (!post) return null; // protección

    const { titulo, slug, contenido, imagen, fecha } = post;

    const imageUrl = imagen?.[0]?.formats?.medium?.url
        ? `http://localhost:1337${imagen[0].formats.medium.url}`
        : null;

    const contenidoPlano = Array.isArray(contenido)
        ? contenido.map(b => b.children?.map(c => c.text).join("")).join(" ")
        : contenido;

    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            {imageUrl && (
                <img src={imageUrl} alt={titulo} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{titulo}</h3>
                <p className="text-sm text-gray-700 mb-4">{contenidoPlano.slice(0, 120)}...</p>
                <a
                    href={`/posts/${slug}`}
                    className="inline-block mt-2 text-blue-600 hover:underline"
                >
                    Leer más →
                </a>
            </div>
        </div>
    );
}

