// src/app/components/HeaderWrapper.jsx
// Server Component: fetch de la última revista para pasarla al Header (client)
import { fetchLatestRevista } from "@/lib/api";
import Header from "./Header";

export default async function HeaderWrapper() {
    let latestSlug = null;
    try {
        const latest = await fetchLatestRevista();
        latestSlug = latest?.slug ?? null;
    } catch {
        // Si Strapi no está disponible, el link de "Número actual" apunta a /revistas
    }

    return <Header latestSlug={latestSlug} />;
}
