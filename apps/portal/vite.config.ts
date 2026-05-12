import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@atom-core': path.resolve(__dirname, '../../packages/atom-core/src'),
    },
  },
  // Portal deploys as a subpath of the atom-docs Pages site:
  // https://walecalfos-dp.github.io/atomds/portal/
  base: command === 'build' ? '/atomds/portal/' : '/',
}))
