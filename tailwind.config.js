/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}", // Adicionado para escanear a pasta de componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}