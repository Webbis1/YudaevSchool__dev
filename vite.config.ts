import { defineConfig } from "vite";
import path from "path";
import pugPlugin from "vite-plugin-pug";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

const options = { pretty: true };
const locals = { name: "My Pug" };

// Список классов для сохранения
const safelist = [
  'burger', 'column', 'container', 'first', 'gradient-border',
  'header', 'header__burger', 'header__burger-icon', 'header__burger-text',
  'header__course', 'header__course-cta', 'header__course-image',
  'header__course-title', 'header__courses', 'header__desktop',
  'header__head', 'header__link', 'header__link_green', 'header__links',
  'header__logo', 'header__logo-image', 'header__menu', 'header__mobile',
  'header__mobile-back', 'header__mobile-content', 'header__mobile-course',
  'header__mobile-course-card', 'header__mobile-course-content',
  'header__mobile-course-count', 'header__mobile-course-head',
  'header__mobile-course-image', 'header__mobile-course-title',
  'header__mobile-curses', 'header__mobile-foot', 'header__mobile-foot-links',
  'header__mobile-foot-section', 'header__mobile-foot-title',
  'header__mobile-link', 'header__mobile-link_green', 'header__mobile-links',
  'header__mobile-mini-link', 'header__section', 'header__section-content',
  'header__section-title', 'header__title', 'link', 'row', 'social',
  'wrapper', 'footer__additional-link', 'footer__additional-links',
  'footer__bottom-section', 'footer__contact-item',
  'footer__contacts-messengers-wrapper', 'footer__contacts-section',
  'footer__contacts-title', 'footer__container', 'footer__copyright',
  'footer__course-link', 'footer__courses-links', 'footer__courses-section',
  'footer__courses-title', 'footer__divider', 'footer__info',
  'footer__info-wrapper', 'footer__link', 'footer__links', 'footer__logo',
  'footer__logo-section', 'footer__messenger-button',
  'footer__messengers-buttons', 'footer__messengers-section',
  'footer__messengers-title', 'footer__mobile-social-grid',
  'footer__mobile-social-section', 'footer__right-section',
  'footer__social-icon', 'footer__social-img', 'footer__social-item',
  'footer__social-name', 'footer__social-section', 'footer__socials-title',
  'footer__title', 'footer__title-main', 'footer__title-sub',
  'green-arrow', 'side-media', 'side-media__text', 'side-media__img'
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
