import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envPlugin from 'vite-plugin-env';

// Other Vite configuration options

export default defineConfig({
  plugins: [
    react(),
    envPlugin(), // Remove the parentheses to fix the error
  ],
});
