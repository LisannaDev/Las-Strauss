import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Utilisez './' si l'application est déployée dans un sous-répertoire.
  build: {
    outDir: 'dist',
  },
});

