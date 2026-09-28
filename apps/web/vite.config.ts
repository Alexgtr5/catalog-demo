import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// относительный base, чтобы сборка работала и локально, и на GitHub Pages в подпапке
export default defineConfig({
  base: './',
  plugins: [react()],
});