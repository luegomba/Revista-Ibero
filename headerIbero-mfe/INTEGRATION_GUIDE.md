# Guía de Integración del Micro Frontend Ibero

## 🎯 Objetivo
Este documento explica cómo integrar el Micro Frontend Ibero en otros proyectos React.

## 📦 Paso 1: Instalar el Micro Frontend

### Opción A: Desde el repositorio local

```bash
npm install file:../headerIbero-mfe
```

O agregar al `package.json`:

```json
{
  "dependencies": {
    "@ibero/header-mfe": "file:../headerIbero-mfe"
  }
}
```

### Opción B: Desde un tarball

```bash
# Crear tarball en headerIbero-mfe
cd headerIbero-mfe
npm pack
cd ../mi-proyecto
npm install ../headerIbero-mfe/ibero-header-mfe-1.0.0.tgz
```

### Opción C: Desde NPM Registry (futuro)

```bash
npm install @ibero/header-mfe
```

## ⚙️ Paso 2: Configurar Tailwind CSS

Si tu proyecto usa Tailwind, agrega el MFE al `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@ibero/header-mfe/dist/**/*.js"
  ],
  theme: {
    extend: {},
  },
}
```

## 🚀 Paso 3: Usar los Componentes

### Ejemplo Básico

```jsx
import React from 'react';
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

function App() {
  return (
    <>
      <Header />
      <MainSection />
      <Footer />
    </>
  );
}

export default App;
```

### Ejemplo Avanzado con Callbacks

```jsx
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

export function MyApp() {
  const handleInfoClick = () => {
    console.log('Usuario solicitó información');
    // Redirigir, abrir modal, etc.
    window.location.href = '/contact';
  };

  const handleIntranetClick = () => {
    console.log('Usuario accedió a intranet');
    window.location.href = '/intranet';
  };

  const handleButtonClick = () => {
    console.log('Usuario inició proceso');
    // Tu lógica aquí
  };

  const customMenuItems = [
    { id: "1", label: "Investigación", url: "/research" },
    { id: "2", label: "Análisis", url: "/analysis" },
    { id: "3", label: "Proyectos", url: "/projects" },
  ];

  const customPrivacyLinks = [
    { id: 1, vinculo: "Política de Privacidad", url: "/privacy" },
    { id: 2, vinculo: "Términos de Servicio", url: "/terms" },
  ];

  return (
    <>
      <Header
        menuItems={customMenuItems}
        onInfoClick={handleInfoClick}
        onIntranetClick={handleIntranetClick}
      />
      
      <MainSection
        subtitle="Mi Proyecto Personalizado"
        title="Bienvenido a Mi Plataforma"
        description="2024-2025"
        buttonText="Comenzar Ahora"
        onButtonClick={handleButtonClick}
      />
      
      <main>
        {/* Tu contenido aquí */}
      </main>
      
      <Footer
        address="Tu Dirección"
        phone="+52 (XX) XXXX-XXXX"
        tollfree="+52 (XX) XXXX-XXXX"
        privacyLinks={customPrivacyLinks}
      />
    </>
  );
}
```

## 📱 Ejemplo: Integrarlo en una Estructura Existente

```jsx
import Layout from './layouts/Layout';
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

export function HomePage() {
  return (
    <Layout>
      <Header />
      <MainSection />
      <div className="py-12 px-4">
        {/* Tu contenido */}
      </div>
      <Footer />
    </Layout>
  );
}
```

## 🎨 Personalización de Estilos

Si necesitas sobrescribir estilos, hazlo después de importar:

```jsx
import '@ibero/header-mfe/styles';
import './my-overrides.css';
```

En `my-overrides.css`:

```css
.main-title {
  color: #ff0000 !important;
  font-size: 5rem !important;
}

.main-button {
  background-color: #007bff !important;
}
```

## 🔄 Con React Router

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

export function App() {
  return (
    <BrowserRouter>
      <Header
        menuItems={[
          { id: "1", label: "Home", url: "/" },
          { id: "2", label: "About", url: "/about" },
          { id: "3", label: "Contact", url: "/contact" },
        ]}
      />
      
      <Routes>
        <Route path="/" element={<MainSection />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      
      <Footer />
    </BrowserRouter>
  );
}
```

## 🐳 Con Docker

Si tu proyecto usa Docker, los componentes funcionarán normalmente en la imagen:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "serve"]
```

## 🚀 Para Producción

```bash
# En el MFE
cd headerIbero-mfe
npm run build

# En tu proyecto
npm install @ibero/header-mfe
npm run build
npm start
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@ibero/header-mfe'"

**Solución:**
```bash
npm install
# Si aún no funciona:
rm -rf node_modules package-lock.json
npm install
```

### Los estilos no se cargan

**Solución:**
```jsx
// Asegúrate de importar los estilos ANTES de usar componentes
import '@ibero/header-mfe/styles';
import { Header } from '@ibero/header-mfe';
```

### Conflicto de versiones de React

**Solución:**
```bash
npm dedupe
```

### TypeScript: No reconoce tipos

**Solución:**
Asegúrate que tu `tsconfig.json` incluye:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## 📊 Ventajas del Micro Frontend

✅ **Reutilizable** - Usa en múltiples proyectos  
✅ **Independiente** - Se construye por separado  
✅ **Versionable** - Controla versiones como cualquier paquete  
✅ **Mantenible** - Un solo lugar para actualizar  
✅ **Escalable** - Añade más componentes fácilmente  

## 🔄 Mantener Actualizado

Cuando actualices el MFE:

```bash
cd headerIbero-mfe
# ... realiza cambios ...
npm run build

cd ../mi-proyecto
npm update @ibero/header-mfe
```

## 📝 Notas

- Los componentes están optimizados para responsive design (mobile, tablet, desktop)
- Usan las fuentes Alverata y Praxis (asegúrate de tenerlas disponibles)
- Todos los componentes aceptan `onClick` handlers para máxima flexibilidad
- Los estilos son modales con Tailwind CSS

## 🔗 Referencias

- [Documentación del MFE](./README.md)
- [Componentes incluidos](./src/components)
- [Estilos CSS](./src/styles.css)
