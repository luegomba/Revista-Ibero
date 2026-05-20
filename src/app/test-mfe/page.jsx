'use client';

// ─────────────────────────────────────────────
// Página de prueba AISLADA para headerIbero-mfe
// Ruta: /test-mfe
// No modifica nada del proyecto principal
// ─────────────────────────────────────────────

import { Header, Footer, MainSection } from '@ibero/header-mfe';

// Estilos del MFE (copiados de node_modules/@ibero/header-mfe/dist/style.css)
import '@/styles/mfe-ibero-header.css';

const menuItemsRevista = [
  { id: "r1", label: "Inicio", url: "/" },
  { id: "r2", label: "Revistas", url: "/revistas" },
  { id: "r3", label: "Artículos", url: "/posts" },
  { id: "r4", label: "Directorio", url: "/directorio" },
];

export default function TestMFEPage() {
  const handleInfoClick = () => {
    alert('Info click — aquí iría tu handler real');
  };

  const handleIntranetClick = () => {
    alert('Intranet click — aquí iría tu handler real');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>

      {/* ── HEADER DEL MFE ── */}
      <Header
        menuItems={menuItemsRevista}
        onInfoClick={handleInfoClick}
        onIntranetClick={handleIntranetClick}
      />

      {/* ── MAIN SECTION DEL MFE ── */}
      <MainSection
        subtitle="Prueba de Micro Frontend"
        title="Revista IBERO — MFE Test"
        description="2025–2026"
        buttonText="Ver Revistas"
        onButtonClick={() => window.location.href = '/revistas'}
      />

      {/* ── CONTENIDO DE PRUEBA ── */}
      <main style={{ padding: '60px 40px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontFamily: 'sans-serif', fontSize: '1.4rem', marginBottom: '12px', color: '#1a1a1a' }}>
            ✅ Header MFE funcionando
          </h2>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Esta página es un <strong>ambiente de prueba aislado</strong>. Los componentes de arriba
            vienen del paquete <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>@ibero/header-mfe</code> instalado
            como dependencia local. No afectan ninguna ruta ni componente existente del proyecto.
          </p>
        </div>

        <div style={{
          background: '#fff4f6',
          border: '1px solid #E00034',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontFamily: 'sans-serif', color: '#E00034', marginBottom: '8px' }}>
            📌 Notas de integración
          </h3>
          <ul style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>El Header usa <strong>Tailwind v3</strong> (compilado a CSS puro en el build)</li>
            <li>El Footer y MainSection están exportados y disponibles</li>
            <li>Las fuentes <em>Alverata</em> y <em>Praxis Next</em> deben cargarse en el proyecto principal para fidelidad visual completa</li>
            <li>Para actualizar el MFE: <code>cd headerIbero-mfe && npm run build</code> y luego refrescar</li>
          </ul>
        </div>
      </main>

      {/* ── FOOTER DEL MFE ── */}
      <Footer />
    </div>
  );
}
