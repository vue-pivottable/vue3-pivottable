import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      dts({
        include: ['src'],
        outDir: 'dist/types',
        staticImport: false,
        insertTypesEntry: true,
        rollupTypes: true
      })
    ],
    publicDir: false,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'LazyTableRenderer',
        fileName: (format) => `lazy-table-renderer.${format}.js`,
        formats: ['es', 'umd']
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          exports: 'named',
          globals: {
            'vue': 'Vue',
            'vue-pivottable': 'VuePivottable'
          }
        }
      },
      sourcemap: true,
      target: 'es2015'
    }
  }
})
