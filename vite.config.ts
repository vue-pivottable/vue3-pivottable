import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/vue-pivottable.css',
          dest: '.'
        }
      ]
    }),
    dts({
      include: ['src'],
      outDir: 'dist/types',
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VuePivottable',
      fileName: (format) => `vue-pivottable.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'vue-draggable-next', 'papaparse'],
      output: {
        exports: 'named',
        globals: {
          'vue': 'Vue',
          'vue-draggable-next': 'VueDraggableNext',
          'papaparse': 'Papa'
        }
      }
    },
    sourcemap: true,
    target: 'es2015'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
