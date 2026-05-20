/**
 * Ejemplo 1: Uso Simple del Micro Frontend Ibero
 * 
 * Este archivo muestra la forma más básica de usar los componentes
 * del micro frontend en una aplicación React.
 */

import React from 'react';
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

function SimpleExample() {
  return (
    <div>
      <Header />
      <MainSection />
      <main className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Tu contenido aquí</h2>
        <p>Este es un ejemplo simple de cómo usar el Micro Frontend Ibero</p>
      </main>
      <Footer />
    </div>
  );
}

export default SimpleExample;
