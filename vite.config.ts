import { defineConfig } from "vite";
import path from "path";
import pugPlugin from "vite-plugin-pug";

const options = { pretty: true };
const locals = { name: "My Pug" };

export default defineConfig({
  base: "./",
  plugins: [pugPlugin(options, locals)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "pug": path.resolve(__dirname, "./src/pug"),
      '@swiper': './node_modules/swiper',
      'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js')
    },
    preserveSymlinks: true,
  },
});
