import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:3000';

// относительный base, чтобы сборка одинаково работала и в корне домена, и в подпапке
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    // фронтенд ходит в API относительным путём, поэтому в разработке его проксируем
    proxy: { '/api': { target: API_TARGET, changeOrigin: true } },
  },
});
