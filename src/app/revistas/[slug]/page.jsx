import axios from "axios";
import Link from "next/link";
import Image from "next/image"; // 👈 Importación faltante
import ArticuloInterior from "@/app/components/ArticuloInterior";

const API_URL = "http://localhost:1337/api";
import PostCard from "../../components/PostCard"; // Ajusta la ruta según dónde tengas el componente

export default async function RevistaPage({ params }) {
    const { slug } = params;

    const res = await axios.get(
        `${API_URL}/revistas?filters[slug][$eq]=${slug}&populate=*`
    );

    const revista = res.data.data[0];

    if (!revista) {
        return <div className="p-6 text-red-500">🚫 Revista no encontrada</div>;
    }

    const { numero, titulo, descripcion, posts } = revista;

    const postsArray = Array.isArray(posts) ? posts : [];

    return (
        <div id="revista-container" className="container">
            <main id="content">
                <div className="upper-info">
                    <p className="revista-title"><span>número {numero}</span></p>
                </div>
                <article className="index">
                    <div className="headings">
                        <h1 className="article-title">{titulo}</h1>
                        <h2 className="article-subtitle"></h2>
                    </div>
                </article>

                {/* 
                {descripcion && (
                    <p className="text-gray-600 text-lg mb-6">
                        {Array.isArray(descripcion)
                            ? descripcion[0]?.children?.[0]?.text
                            : descripcion}
                    </p>
                )}
                */}


                <div class="articles-container">
                    {postsArray.length > 0 ? (
                        postsArray.map((post) => {
                            const { titulo, slug, contenido, imagen } = post;

                            const resumen = Array.isArray(contenido)
                                ? contenido[0]?.children?.[0]?.text?.slice(0, 120) + "..."
                                : "";

                            const imageUrl = imagen?.[0]?.formats?.medium?.url
                                ? `http://localhost:1337${imagen[0].formats.medium.url}`
                                : null;

                            return (

                                <Link class="article-link" href={`/posts/${slug}`}>
                                    <div class="article-card">
                                        <div class="image">
                                            <img src="/numero/96/la-voz-de-la-ibero.png" />
                                            {imageUrl && (
                                                <Image
                                                    src={imageUrl}
                                                    alt={titulo}
                                                    width={600}
                                                    height={400}
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}
                                        </div>
                                        <div class="body">
                                            <span class="section">Sección</span>
                                            <h4 class="title">{titulo}</h4>
                                            <p class="author">Autor</p>
                                        </div>
                                    </div>
                                </Link>
                            )


                        })
                    ) : (
                        <p>No hay artículos en esta revista.</p>
                    )}

                </div>

            </main>
        </div>
    );
}
