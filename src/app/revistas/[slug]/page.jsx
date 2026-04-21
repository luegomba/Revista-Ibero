import axios from "axios";
import Link from "next/link";
import Image from "next/image"; // 👈 Importación faltante
import ArticuloInterior from "@/app/components/ArticuloInterior";

const API_URL = "http://localhost:1337/api";
import PostCard from "../../components/PostCard"; // Ajusta la ruta según dónde tengas el componente

export default async function RevistaPage({ params }) {
    const { slug } = params;

    const res = await axios.get(
        `${API_URL}/revistas?filters[slug][$eq]=${slug}&populate[posts][populate]=imagen`
    );

    const revista = res.data.data[0];

    if (!revista) {
        return <div className="p-6 text-red-500">🚫 Revista no encontrada</div>;
    }

    const { titulo, descripcion, posts } = revista;

    const postsArray = Array.isArray(posts) ? posts : [];

    return (
        <main className="px-4 py-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{titulo}</h1>
            {descripcion && (
                <p className="text-gray-600 text-lg mb-6">
                    {Array.isArray(descripcion)
                        ? descripcion[0]?.children?.[0]?.text
                        : descripcion}
                </p>
            )}

            {postsArray.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postsArray.map((post) => {
                        const { titulo, slug, contenido, imagen } = post;

                        const resumen = Array.isArray(contenido)
                            ? contenido[0]?.children?.[0]?.text?.slice(0, 120) + "..."
                            : "";

                        const imageUrl = imagen?.[0]?.formats?.medium?.url
                            ? `http://localhost:1337${imagen[0].formats.medium.url}`
                            : null;

                        return (
                            <div key={post.id} className="border rounded-lg overflow-hidden shadow">
                                {imageUrl && (
                                    <Image
                                        src={imageUrl}
                                        alt={titulo}
                                        width={600}
                                        height={400}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{titulo}</h2>
                                    <p className="text-gray-600 mb-4 text-sm">{resumen}</p>
                                    <Link
                                        href={`/posts/${slug}`}
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        Leer más →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 mt-6">No hay artículos en esta revista.</p>
            )}
        </main>
    );
}
