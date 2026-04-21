// src/app/layout.js
import "./globals.css";
import Footer from "./components/Footer";
import HeaderWrapper from "./components/HeaderWrapper";

export const metadata = {
    title: "Revista IBERO",
    description: "Revista de la Universidad Iberoamericana",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                {/* Adobe Fonts / Typekit */}
                <link rel="stylesheet" href="https://use.typekit.net/ahd4jsn.css" />
            </head>
            <body>
                <HeaderWrapper />
                {children}
                <Footer />
            </body>
        </html>
    );
}
