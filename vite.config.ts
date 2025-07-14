import { defineConfig } from "vite";
import path from "path";
import pugPlugin from "vite-plugin-pug";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

const options = { pretty: true };
const locals = { name: "My Pug" };

// Список классов для сохранения
const safelist = [
  "burger",
  "column",
  "container" /* ... остальные классы ... */,
];

export default defineConfig({
  base: "./",
  plugins: [pugPlugin(options, locals)],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/scss/_variables.scss";`
      },
    },
    postcss: {
      plugins: [
        purgeCSSPlugin({
          content: [
            "./src/**/*.pug",
            "./src/**/*.js",
            "./src/**/*.vue",
            "./src/**/*.scss",
          ],
          safelist: [...safelist, /^swiper/, /^aos/, /^is-/],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          fontFace: true,
          keyframes: true,
        }),
      ],
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
