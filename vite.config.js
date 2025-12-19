import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/fruit-frontend/',   // 👈 必须和仓库名一致
  build: {
    outDir: 'docs'            // 👈 GitHub Pages 默认可识别
  }
})