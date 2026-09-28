import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH in deployments that serve the app below a repository path.
export default defineConfig({ plugins: [react()], base: process.env.VITE_BASE_PATH || '/' })

