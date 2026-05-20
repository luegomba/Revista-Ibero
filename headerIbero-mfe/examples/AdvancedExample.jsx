/**
 * Ejemplo 2: Uso Avanzado con Callbacks y Personalización
 * 
 * Muestra cómo personalizar los componentes con props y callbacks.
 */

import React from 'react';
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

function AdvancedExample() {
  // Elementos de menú personalizados
  const menuItems = [
    { id: "1", label: "Inicio", url: "/" },
    { id: "2", label: "Proyectos", url: "/projects" },
    { id: "3", label: "Acerca de", url: "/about" },
    { id: "4", label: "Contacto", url: "/contact" },
  ];

  // Enlaces de privacidad personalizados
  const privacyLinks = [
    { id: 1, vinculo: "Política de Privacidad", url: "/privacy" },
    { id: 2, vinculo: "Términos de Servicio", url: "/terms" },
    { id: 3, vinculo: "Cookies", url: "/cookies" },
  ];

  // Manejadores de eventos
  const handleInfoClick = () => {
    alert('¿Necesitas información? Contacta con nosotros');
  };

  const handleIntranetClick = () => {
    window.location.href = 'https://intranet.tudominio.com';
  };

  const handleMainButtonClick = () => {
    console.log('El usuario hizo clic en el botón de acción principal');
    // Aquí puedes navegar, abrir un modal, enviar analytics, etc.
  };

  return (
    <div>
      <Header
        logoSrc="https://tu-dominio.com/logo.png"
        menuItems={menuItems}
        onInfoClick={handleInfoClick}
        onIntranetClick={handleIntranetClick}
      />

      <MainSection
        subtitle="Descubre Nuestras Soluciones"
        title="Transformando Ideas en Realidad"
        description="Únete a miles de usuarios satisfechos"
        buttonText="Explorar Más"
        onButtonClick={handleMainButtonClick}
      />

      <main className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">¿Por qué elegirnos?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Innovación</h3>
              <p className="text-gray-600">Utilizamos las últimas tecnologías</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Confianza</h3>
              <p className="text-gray-600">Protegemos tus datos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Soporte 24/7</h3>
              <p className="text-gray-600">Siempre disponibles para ti</p>
            </div>
          </div>
        </div>
      </main>

      <Footer
        address="Calle Principal 123, Ciudad"
        phone="+52 (55) 0000-0000"
        tollfree="+52 (55) 0000-0001"
        logoSrc="https://tu-dominio.com/logo-dark.png"
        privacyLinks={privacyLinks}
      />
    </div>
  );
}

export default AdvancedExample;
