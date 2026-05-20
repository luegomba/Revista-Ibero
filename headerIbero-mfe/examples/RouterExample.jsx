/**
 * Ejemplo 3: Usar el MFE con React Router
 * 
 * Integración completa con routing en una SPA (Single Page Application)
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

// Componentes de página
const HomePage = () => (
  <main className="min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Bienvenido</h2>
      <p>Esta es la página de inicio</p>
    </div>
  </main>
);

const ProjectsPage = () => (
  <main className="min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Proyectos</h2>
      <p>Lista de proyectos</p>
    </div>
  </main>
);

const AboutPage = () => (
  <main className="min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Acerca de</h2>
      <p>Información sobre nosotros</p>
    </div>
  </main>
);

const ContactPage = () => (
  <main className="min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Contacto</h2>
      <p>Formulario de contacto</p>
    </div>
  </main>
);

// App Principal
function RouterExample() {
  const menuItems = [
    { id: "1", label: "Inicio", url: "/" },
    { id: "2", label: "Proyectos", url: "/projects" },
    { id: "3", label: "Acerca de", url: "/about" },
    { id: "4", label: "Contacto", url: "/contact" },
  ];

  return (
    <BrowserRouter>
      <div>
        <Header
          menuItems={menuItems}
          onInfoClick={() => window.location.href = '/contact'}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default RouterExample;
