import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Caminhos relativos no build: o Live Server consegue abrir a pasta dist
  base: command === 'build' ? './' : '/',
}))
