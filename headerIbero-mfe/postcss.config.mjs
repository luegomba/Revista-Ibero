// PostCSS config local para el MFE (Tailwind v3)
// Este archivo evita que Vite tome el postcss.config.mjs del proyecto padre (Next.js con Tailwind v4)
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
