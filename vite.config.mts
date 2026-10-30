import path from "node:path";
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // import.meta.dirname, not __dirname: this file is an ES module.
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    env: { VITE_API_URL: "http://localhost:4000" },
  },
});
