import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    // sourcemap: true,
    // manifest: true,
    outDir: 'build',
    assetsDir: 'static',
    minify: 'esbuild',
  },
  server: {
    host: '0.0.0.0',
  },
});
