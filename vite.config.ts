import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: 'strip-live-server-redirect',
      apply: 'build',
      transformIndexHtml(html) {
        return html
          .replace(
            /\s*<script>\s*\(function \(\) \{\s*var port = location\.port;[\s\S]*?dist\/index\.html[\s\S]*?\}\)\(\);\s*<\/script>/,
            '',
          )
          .replace(
            /\s*<script>\s*\(function \(\) \{\s*var port = location\.port;[\s\S]*?cep-fetch-patch[\s\S]*?\}\)\(\);\s*<\/script>/,
            '\n    <script src="./cep-fetch-patch.js"></script>',
          );
      },
    },
  ],
  // Caminhos relativos no build: o Live Server consegue abrir a pasta dist
  base: command === 'build' ? './' : '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
}))
