import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@atom-core': path.resolve(__dirname, '../../packages/atom-core/src'),
    },
  },
  // Use `/atomds/` base for production builds (GitHub Pages project site
  // at https://walecalfos-dp.github.io/atomds/). Keep `/` for local dev
  // so the dev server still serves at the root.
  base: command === 'build' ? '/atomds/' : '/',
}))
