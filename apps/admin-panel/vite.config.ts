import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isMobile = mode === 'mobile'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: isMobile ? 'dist-mobile' : 'dist-desktop',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            motion: ['framer-motion'],
            store: ['zustand'],
          },
        },
      },
    },
    server: {
      port: isMobile ? 3005 : 3006,
      open: true,
    },
    define: {
      'process.env': process.env,
      __IS_MOBILE__: isMobile,
    },
  }
})
