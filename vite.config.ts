import { defineConfig } from 'vite';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  root: path.resolve(__dirname, 'src/ui'), // Set root to src/ui
  server: {
    port: 3000, // Specify port
    open: true, // Automatically open in browser
    https: true, // Enable HTTPS with basicSsl
  },
  build: {
    outDir: path.resolve(__dirname, 'dist_ui'), // Specify output directory for the standalone UI build
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/ui/index.html')
      }
    }
  },
  plugins: [
    basicSsl() // Enable if HTTPS is needed for testing
  ]
});
