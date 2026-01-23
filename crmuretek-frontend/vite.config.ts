import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Make sure this plugin is here!

export default defineConfig({
  // @ts-ignore
  plugins: [react(), tailwindcss()],
});
