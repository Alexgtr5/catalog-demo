import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// относительный base, чтобы сборка одинаково работала и в корне домена, и в подпапке
export default defineConfig({
  base: './',
  plugins: [react()],
});