/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores base de la app
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        
        // Temas de equipos argentinos
        boca: {
          azul: '#003D7A',
          oro: '#FFD100'
        },
        river: {
          rojo: '#E4002B',
          blanco: '#FFFFFF'
        },
        independiente: {
          rojo: '#E30613'
        },
        racing: {
          celeste: '#87CEEB',
          blanco: '#FFFFFF'
        },
        sanlorenzo: {
          azul: '#003F87',
          rojo: '#ED1C24'
        },
        velez: {
          azul: '#005EB8',
          blanco: '#FFFFFF'
        },
        newells: {
          rojo: '#E4002B',
          negro: '#000000'
        },
        central: {
          azul: '#003D7A',
          amarillo: '#FFD100'
        },
        estudiantes: {
          rojo: '#E4002B',
          blanco: '#FFFFFF'
        }
      },
      backgroundImage: {
        'grass-light': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2310b981\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'grass-dark': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2310b981\" fill-opacity=\"0.08\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite'
      }
    },
  },
  plugins: [],
}
