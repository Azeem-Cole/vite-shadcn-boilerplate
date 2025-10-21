import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), dts(), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: [resolve(__dirname, "index.ts"), "src/index.css"],
      name: "UI",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
      cssFileName: "index.css",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  optimizeDeps: {},
});
