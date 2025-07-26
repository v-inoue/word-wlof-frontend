import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/word-wolf-frontend/',
  plugins: [react()],
  build: {
    assetsDir: '', // assetsフォルダを作らず、ルート直下にファイルを配置
  },
})