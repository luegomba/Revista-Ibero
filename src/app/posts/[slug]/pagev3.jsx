// src/app/posts/[slug]/page.jsx
import axios from "axios";
import qs from "qs";
import PostLayout from "@/app/components/PostLayout"; // 👈 ajusta si tu ruta es distinta

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

    return <PostLayout post={post} />;
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