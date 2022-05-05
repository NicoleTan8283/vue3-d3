import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import WindiCSS from 'vite-plugin-windicss'
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    WindiCSS()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
})
