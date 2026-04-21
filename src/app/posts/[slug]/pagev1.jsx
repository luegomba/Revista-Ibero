import axios from "axios";
import Image from "next/image";

const API_URL = "http://localhost:1337/api";

export default async function PostPage({ params }) {
    const slug = params.slug;

    const res = await axios.get(
        `${API_URL}/posts?filters[slug][$eq]=${slug}&populate=*`
    );

    const post = res.data.data[0];

    if (!post) {
        return <div className="p-6 text-red-500">🚫 Post no encontrado</div>;
    }

    const { titulo, contenido, imagen } = post;

    // ✅ Ajuste para array de imágenes
    const imagenData = Array.isArray(imagen) ? imagen[0] : null;

    const imageUrl = imagenData?.url
        ? `http://localhost:1337${imagenData.url}`
        : null;

    const contenidoPlano = Array.isArray(contenido)
        ? contenido.map(bloque => bloque.children?.map(c => c.text).join("")).join("\n\n")
        : contenido;

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{titulo}</h1>

            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={imagenData?.name || "Imagen del post"}
                    width={800}
                    height={400}
                    className="rounded-lg mb-4"
                    priority
                />
            )}

            <p className="whitespace-pre-line text-lg leading-relaxed">
                {contenidoPlano}
            </p>
        </main>
    );
}

export async function generateStaticParams() {
    const res = await axios.get(`${API_URL}/posts`);
    const posts = res.data.data;

    return posts
        .filter((post) => post.slug)
        .map((post) => ({
            slug: post.slug,
        }));
}
