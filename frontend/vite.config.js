import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Use 127.0.0.1 instead of localhost
    port: 5173,        // Optional: Specify the port explicitly
  },
})
