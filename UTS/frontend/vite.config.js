import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Port 5173 dipakai agar tidak bentrok dengan Server A (3000) dan Server B (4000)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
