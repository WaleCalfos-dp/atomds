import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  publicDir: path.resolve(__dirname, '../public'),
  // Use `/atom/` base for production builds (GitHub Pages project site),
  // but keep `/` for local dev so the dev server still serves at the root.
  base: command === 'build' ? '/atom/' : '/',
}))
