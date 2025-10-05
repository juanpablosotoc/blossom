import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'), // since your index.html lives here
  publicDir: path.resolve(__dirname, 'src/public'),
  plugins: [react(), svgr()],
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@myFrames': path.resolve(__dirname, 'src/renderer/frames'),
      '@myComponents': path.resolve(__dirname, 'src/renderer/components'),
      '@myPages': path.resolve(__dirname, 'src/renderer/pages'),
      '@myAssets': path.resolve(__dirname, 'src/renderer/assets'),
      '@myStyles': path.resolve(__dirname, 'src/renderer/styles'),
      '@myUtils': path.resolve(__dirname, 'src/renderer/utils')
    }
  }
})