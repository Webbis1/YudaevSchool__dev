import { defineConfig } from "vite";
import path from "path";
import pugPlugin from "vite-plugin-pug";
// import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
// import svgr from 'vite-plugin-svgr';
// import createSvgSpritePlugin from "vite-plugin-svg-sprite";

const options = { pretty: true };
const locals = { name: "My Pug" };

export default defineConfig({
  base: "./",
  plugins: [
    pugPlugin(options, locals),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/scss/_variables.scss";`
      },
    },
  },
  build: {
    minify: false, // Отключите минификацию для читаемости
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "home.css") {
            return "assets/css/home.[hash].css";
          }
          return "assets/[name].[hash].[ext]";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      pug: path.resolve(__dirname, "./src/pug"),
      "@swiper": "./node_modules/swiper",
      jquery: path.resolve(__dirname, "node_modules/jquery/dist/jquery.js"),
    },
    preserveSymlinks: true,
  },
});
