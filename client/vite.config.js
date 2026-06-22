import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During dev, proxy /api and /uploads to the Express server so the frontend
// can call the API on the same origin (no CORS headaches).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/uploads": "http://localhost:4000",
    },
  },
});
