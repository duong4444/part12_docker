import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true, // Đảm bảo HMR được bật
    watch: {
      usePolling: true, // Bật polling để theo dõi file
    }
  }
});