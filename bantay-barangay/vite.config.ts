import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" lets the built app be opened from any static host or sub-folder.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
