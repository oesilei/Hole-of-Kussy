import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cyberpunk-red-character-manager/', // IMPORTANTE: Mude 'cyberpunk-red-character-manager' para o nome do seu repositório no GitHub.
})
