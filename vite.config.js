import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep local development at the origin root, and make production builds work on
// this repository's GitHub Pages project path even when no env var is supplied.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || (mode === 'production' ? '/Prateek-Mishra-Portfolio/' : '/'),
}))
