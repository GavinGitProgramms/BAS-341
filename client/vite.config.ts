import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log(`Using API base URL: ${process.env.API_BASE_URL}`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Using the '/api' prefix to distinguish API requests
      // that should be forwarded to the backend server
      '/api': {
        target: process.env.API_BASE_URL, // The backend server's address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite '/api' from the path
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url,
            )
          })
        },
      },
    },
  },
})
