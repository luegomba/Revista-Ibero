"use client";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="p-4 bg-black text-white">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="text-xl font-bold">
                    📝 Mi Blog
                </Link>
            </div>
        </nav>
    );
}