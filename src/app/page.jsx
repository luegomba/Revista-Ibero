import { fetchPosts } from "@/lib/api";
import PostCard from "./components/PostCard";

export default async function Home() {
    const posts = await fetchPosts();

    return (
        <main className="px-4 py-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Revista Universidad Iberoamericana</h1>
            <h2 className="text-xl mb-6">Últimos números</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                    ))}
            </div>
        </main>
    );
}
