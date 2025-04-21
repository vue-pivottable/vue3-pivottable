import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [
      vue(),
      dts({
        include: ['src/**/*.{js,ts,vue,d.ts}'],
        outDir: 'dist',
        staticImport: false,
        insertTypesEntry: true,
        rollupTypes: true
      })
    ],
    publicDir: false,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'LazyTableRenderer',
        fileName: (format) => `lazy-table-renderer.${format}.js`
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          exports: 'named',
          globals: {
            vue: 'Vue'
          }
        }
      },
      sourcemap: true,
      target: 'es2015'
    }
  }
})
