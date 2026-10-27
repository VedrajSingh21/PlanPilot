import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createGeminiProxy } from './server/geminiProxy.js';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createGeminiProxy()
  ],
  server: {
    port: 5174,
    host: true
  }
});
