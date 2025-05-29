// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Make sure to import 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is crucial for shadcn/ui and your general component imports
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib/utils": path.resolve(__dirname, "./src/lib/utils"),
      // You might want to add other aliases for convenience, e.g.:
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
      // If your icons are directly under components, this might be useful too
      "@/icons": path.resolve(__dirname, "./src/components/icons"),
    },
  },
});