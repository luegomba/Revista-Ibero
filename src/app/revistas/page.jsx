// src/app/revistas/page.jsx
import { fetchRevistas } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Números de la Revista | Revista IBERO",
    description: "Explora todos los números de la Revista de la Universidad Iberoamericana.",
};

export default async function RevistasPage() {
    const revistas = await fetchRevistas();

    return (
        <main id="content">
            <article className="index revista">

                <div className="headings">
                    <h1 className="article-title">Revista IBERO</h1>
                    <h2 className="article-subtitle">ÚLTIMAS EDICIONES</h2>
                </div>

                <div className="articles-container">
                    {revistas.map((revista) => {
                        const { id, titulo, slug, numero, tema, descripcion, portada } = revista;

                        // Normaliza portada
                        const portadaObj = Array.isArray(portada) ? portada[0] : portada ?? null;
                        const portadaUrl = portadaObj?.formats?.medium?.url
                            ? `http://localhost:1337${portadaObj.formats.medium.url}`
                            : portadaObj?.url
                                ? `http://localhost:1337${portadaObj.url}`
                                : null;

                        // Extrae texto plano de descripcion (Blocks)
                        const descripcionTexto = Array.isArray(descripcion)
                            ? descripcion
                                .map((b) => b.children?.map((c) => c.text).join("") || "")
                                .join(" ")
                            : descripcion ?? "";

                        return (
                            <Link key={id} className="article-link" href={`/revistas/${slug}`}>
                                <div className="article-card revista">
                                    <div className="head">
                                        <div className="magazine">
                                            {portadaUrl ? (
                                                <Image
                                                    className="portada"
                                                    src={portadaUrl}
                                                    alt={`Portada ${titulo}`}
                                                    width={300}
                                                    height={400}
                                                    priority={numero === revistas[0]?.numero}
                                                />
                                            ) : (
                                                <div className="portada" style={{
                                                    width: 300,
                                                    height: 400,
                                                    background: "#e5e7eb",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "0.75rem",
                                                    color: "#9ca3af"
                                                }}>
                                                    Sin portada
                                                </div>
                                            )}
                                            <img className="magazine-inner" src="/img/magazine-text.webp" alt="" aria-hidden="true" />
                                        </div>

                                        {portadaUrl && (
                                            <Image
                                                className="backdrop"
                                                src={portadaUrl}
                                                alt=""
                                                aria-hidden="true"
                                                width={300}
                                                height={400}
                                            />
                                        )}
                                    </div>

                                    <div className="body">
                                        {numero && (
                                            <span className="number">número {numero}</span>
                                        )}
                                        <h4 className="title">{titulo}</h4>
                                        {descripcionTexto && (
                                            <p className="summary">{descripcionTexto}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </article>
        </main>
    );
}
