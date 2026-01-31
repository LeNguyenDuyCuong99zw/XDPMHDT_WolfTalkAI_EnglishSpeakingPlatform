import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
// Admin app configuration - runs on admin.localhost:3001
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    port: 3001,
    host: "127.0.0.1",
    middlewareMode: false,
  },
  appType: "spa",
  build: {
    rollupOptions: {
      input: {
        admin: resolve(__dirname, "admin.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  // Fallback to admin.html for SPA routing
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  // Custom plugin to handle SPA routing
  plugins: [
    react(),
    {
      name: "admin-spa-fallback",
      apply: "serve" as const,
      configResolved(config) {
        // After server setup
      },
      transformIndexHtml: {
        order: "pre",
        handler() {
          return fs.readFileSync(path.join(__dirname, "admin.html"), "utf-8");
        },
      },
    },
  ],
});
