import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Match your current port
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Point to your Express server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
