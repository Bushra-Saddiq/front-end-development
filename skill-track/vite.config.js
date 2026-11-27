import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard Vite + React setup. No extra options needed.
export default defineConfig({
  plugins: [react()],
})
