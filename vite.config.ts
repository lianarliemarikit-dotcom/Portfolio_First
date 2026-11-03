import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// Relative assets work both at a repository URL and a custom domain.
export default defineConfig({ plugins: [react(), tailwindcss()], base: './', build: { chunkSizeWarningLimit: 1100 } });