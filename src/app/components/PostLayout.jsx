// src/app/posts/[slug]/PostLayout.jsx

import Image from "next/image";
import RichContent from "@/app/components/RitchContent";

export default function PostLayout({ post }) {
    const {
        titulo, contenido, autor, imagen, fecha, referencias = [] } = post;

    const imageUrl = imagen?.[0]?.formats?.medium?.url
        ? `http://localhost:1337${imagen[0].formats.medium.url}`
        : null;

    return (
        <div className="bg-white text-gray-900">
            {/* Header */}
            <header className="bg-black text-white py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-semibold">Revista de la Universidad Iberoamericana</h1>
                    <nav className="space-x-6 text-sm">
                        <a href="#">Número actual</a>
                        <a href="#">Números anteriores</a>
                        <a href="#">Directorio</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar autor */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="text-center mt-4 font-bold text-sm">{autor?.nombre || "Autor"}</h2>
                        <Image
                            src="/autor.jpg"
                            alt="Autor"
                            width={100}
                            height={100}
                            className="rounded-full mx-auto"
                        />
                        <p className="text-xs text-center text-gray-600">{autor?.bio || "Semblanza del autor"}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold mb-2 uppercase">En este artículo:</h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Subtema 1</li>
                            <li>Subtema 2</li>
                            <li>Referencias</li>
                        </ul>
                    </div>
                </aside>

                {/* Contenido principal */}
                <article className="lg:col-span-3 space-y-6">
                    <p className="text-sm uppercase tracking-wide text-gray-500">NÚMERO 96 | IA EN LA EDUCACIÓN</p>
                    <h1 className="text-4xl font-bold text-black leading-snug">{titulo}</h1>
                    <h2 className="text-orange-600 text-xl font-medium">Repensar la educación en la era de la IA</h2>

                    {/* Audio player simulado */}
                    <div className="bg-gray-200 p-4 rounded flex items-center gap-4">
                        <button className="bg-white p-2 rounded-full">▶️</button>
                        <span className="uppercase">Escuchar este artículo</span>
                    </div>

                    {/* Contenido */}
                    <RichContent content={contenido} />

                    <hr/>
                    {/* Referencias */}
                    <section>
                        <h3 className="text-lg font-semibold mt-12 mb-4">Referencias</h3>
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

            {/* Footer */}
            <footer className="bg-gray-100 text-gray-600 text-sm py-6 mt-10">
                <div className="flex flex-col w-full h-fit bg-[#374151] text-[#e5e7eb] px-20 py-14">
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-2 w-[35%] w-[35%]">
                            <div className="flex items-center w-full gap-4">
                                <img alt="Logo Preview" src="https://tailwind-generator.b-cdn.net/favicon.png"
                                     width="119"/>

                            </div>
                            <div className="grid grid-cols-3 gap-6 w-fit p-4"><a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="fill-current">
                                    <path
                                        d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                </svg>
                            </a> <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="fill-current">
                                    <path
                                        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                                </svg>
                            </a> <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     className="fill-current">
                                    <path
                                        d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                                </svg>
                            </a>
                            </div>

                        </div>
                        <div className="flex flex-row w-[35%] gap-16 text-nowrap">
                            <div className="grid grid-cols-3 gap-28">
                                <div className="flex flex-col gap-2">
                                    <div className="font-bold uppercase text-[#9ca3af] pb-3">Explore</div>
                                    <a href="#xxx" className="hover:underline">Features</a> <a href="#xxx"
                                                                                               className="hover:underline">Docs</a>
                                    <a href="#xxx" className="hover:underline">Pricing</a> <a href="#xxx"
                                                                                              className="hover:underline">Security</a>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="font-bold uppercase text-[#9ca3af] pb-3">Comany</div>
                                    <a href="#xxx" className="hover:underline">About Us</a> <a href="#xxx"
                                                                                               className="hover:underline">Contact</a>
                                    <a href="#xxx" className="hover:underline">Support</a> <a href="#xxx"
                                                                                              className="hover:underline">News</a>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="font-bold uppercase text-[#9ca3af] pb-3">Legal</div>
                                    <a href="#xxx" className="hover:underline">Imprint</a> <a href="#xxx"
                                                                                              className="hover:underline">Privacy
                                    Policy</a> <a href="#xxx" className="hover:underline">Terms of Use</a>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
