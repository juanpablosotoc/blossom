import { defineConfig } from 'electron-vite'
import { resolve } from 'node:path'
import svgr from '@svgr/rollup'

export default defineConfig({
  main: {
    build: { rollupOptions: { input: resolve(__dirname, 'src/index.ts') } }
  },
  preload: {
    build: { rollupOptions: { input: { index: resolve(__dirname, 'src/preload.ts') } } }
  },
  renderer: {
    // Renderer root is src/renderer, and HTML lives here
    root: resolve(__dirname, 'src/renderer'),
    publicDir: resolve(__dirname, 'src/public'), // optional static assets
    plugins: [svgr()],
    build: {
      // Explicit HTML entry so the plugin is happy
      rollupOptions: { input: resolve(__dirname, 'src/renderer/index.html') },
      outDir: resolve(__dirname, 'dist/renderer'),
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer'),
        '@myFrames': resolve(__dirname, 'src/renderer/frames'),
        '@myComponents': resolve(__dirname, 'src/renderer/components'),
        '@myPages': resolve(__dirname, 'src/renderer/pages'),
        '@myAssets': resolve(__dirname, 'src/renderer/assets'),
        '@myStyles': resolve(__dirname, 'src/renderer/styles'),
        '@myUtils': resolve(__dirname, 'src/renderer/utils')
      }
    }
  }
})
