import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    /*
    host: true,
    allowedHosts: [
      "payroll.tia.deployreal.com",
      // aquí podrías añadir más, por ejemplo:
      // 'hr.tia.deployreal.com',
      // 'facilities.tia.deployreal.com'
    ],
    */
  },
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
  },
});
