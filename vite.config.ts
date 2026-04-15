import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use the default `public/` dir colocated with this Vite project.
  // (The previous `'../public'` pointed to a stale screenshot dump
  // outside the repo and skipped the real tracked favicon.)
})
