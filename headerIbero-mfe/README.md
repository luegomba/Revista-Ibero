# 🎨 Micro Frontend Ibero - Header Components

Componentes reutilizables de la Universidad Iberoamericana como micro frontend independiente.

## 📦 Componentes Incluidos

- **Header** - Navegación superior con menú responsive
- **MainSection** - Sección principal con llamada a acción
- **Footer** - Pie de página con contacto y redes sociales

## 🚀 Instalación

### Opción 1: Como módulo local (recomendado para desarrollo)

```bash
npm install ../../headerIbero-mfe
```

O en el `package.json`:

```json
{
  "dependencies": {
    "@ibero/header-mfe": "file:../headerIbero-mfe"
  }
}
```

### Opción 2: Importar directamente

```bash
# Construir el micro frontend
cd headerIbero-mfe
npm install
npm run build
```

## 📖 Uso Básico

```jsx
import { Header, MainSection, Footer } from '@ibero/header-mfe';
import '@ibero/header-mfe/styles';

export function App() {
  return (
    <>
      <Header />
      <MainSection />
      <Footer />
    </>
  );
}
```

## 🎯 Componentes Detallados

### Header

```jsx
<Header
  logoSrc="https://tu-logo.png"
  menuItems={[
    { id: "1", label: "Inicio", url: "/" },
    { id: "2", label: "Acerca de", url: "/about" }
  ]}
  onInfoClick={() => console.log('Info clicked')}
  onIntranetClick={() => console.log('Intranet clicked')}
/>
```

**Props:**
- `logoSrc` (string) - URL del logo (default: IBERO)
- `menuItems` (array) - Items del menú
- `onInfoClick` (function) - Callback para botón de información
- `onIntranetClick` (function) - Callback para botón de intranet

### MainSection

```jsx
<MainSection
  subtitle="Primera Convocatoria"
  title="Buenas Prácticas"
  description="2024-2025"
  buttonText="Iniciar"
  onButtonClick={() => console.log('Button clicked')}
/>
```

**Props:**
- `subtitle` (string) - Subtítulo
- `title` (string) - Título principal
- `description` (string) - Descripción
- `buttonText` (string) - Texto del botón
- `onButtonClick` (function) - Callback del botón

### Footer

```jsx
<Footer
  address="Calle Principal 123"
  phone="+52 (55) 5950-4000"
  tollfree="+52 (55) 5950-4002"
  logoSrc="https://logo.png"
  privacyLinks={[
    { id: 1, vinculo: "Política", url: "/policy" }
  ]}
/>
```

**Props:**
- `address` (string) - Dirección
- `phone` (string) - Teléfono
- `tollfree` (string) - Número sin costo
- `logoSrc` (string) - URL del logo
- `privacyLinks` (array) - Enlaces de pie
- `socialLinks` (array) - Enlaces de redes sociales

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Build de desarrollo (watch)
npm run dev

# Build para producción
npm run build

# Verificar tipos
npm run type-check
```

## 📋 Dependencias

### Peer Dependencies
- `react` ^18.0.0
- `react-dom` ^18.0.0

### Dependencies
- `lucide-react` - Iconos
- `tailwindcss` - Estilos (solo en desarrollo)

## 🎨 Estilos

El componente usa Tailwind CSS. Asegúrate de tener Tailwind configurado en tu proyecto:

```js
// tailwind.config.js
module.exports = {
  content: [
    'node_modules/@ibero/header-mfe/dist/**/*.js'
  ]
}
```

O importa los estilos CSS directamente:

```jsx
import '@ibero/header-mfe/styles';
```

## 🌐 Exportaciones

El paquete exporta componentes individuales para tree-shaking:

```jsx
// Importar todos
import { Header, MainSection, Footer } from '@ibero/header-mfe';

// O importar individual
import Header from '@ibero/header-mfe/Header';
import MainSection from '@ibero/header-mfe/MainSection';
import Footer from '@ibero/header-mfe/Footer';

// Importar estilos
import '@ibero/header-mfe/styles';
```

## 📦 Distribución

Para usar en otros proyectos:

1. **NPM Local:**
   ```bash
   npm link
   # En otro proyecto:
   npm link @ibero/header-mfe
   ```

2. **Tarball:**
   ```bash
   npm pack
   # Compartir headerIbero-mfe-1.0.0.tgz
   ```

3. **Registro NPM:**
   ```bash
   npm publish
   ```

## 🔄 Module Federation

Para usar con Module Federation en Webpack 5+:

```js
// webpack.config.js
new ModuleFederationPlugin({
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})
```

## 📝 Licencia

© 2024 Universidad Iberoamericana

## 🤝 Contribución

Para actualizar los componentes:

1. Edita los archivos en `src/components/`
2. Ejecuta `npm run build`
3. Verifica que todo funcione correctamente
4. Actualiza la versión en `package.json`

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo de la Universidad Iberoamericana.
