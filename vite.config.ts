import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from "rollup-plugin-visualizer";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import checker from "vite-plugin-checker";
import viteCompression from "vite-plugin-compression";
import legacy from "@vitejs/plugin-legacy";
import WindiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
const BUILD_VSL = process.env.BUILD_VSL !== undefined;
const filter = /\.(js|css|json|txt|html|ico|svg|ttf|eot|woff)(\?.*)?$/i;
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      dts: resolve('./components.d.ts'),
      resolvers: [ElementPlusResolver()]
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    WindiCSS({
      preflight: false,
    }),
    legacy({
      ignoreBrowserslistConfig: true,
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    BUILD_VSL && visualizer({
      gzipSize: true,
      brotliSize: true,
      open: true,
    }),
    viteCompression({
      filter,
      threshold: 10240
    }),
    chunkSplitPlugin(),
    {
      ...checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{vue,js,mjs,cjs,jsx,ts,tsx}"',
          dev: {
            logLevel: ["error"],
          },
        },
      }),
      apply: "serve",
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: ["es2015"],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.12:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
