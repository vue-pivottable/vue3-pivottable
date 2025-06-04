import { defineConfig } from 'eslint/config'
import standardjs from '@seungwoo321/eslint-plugin-standard-js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default defineConfig([
  {
    ignores: [
      'packages/plotly-renderer/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.history/**',
      '**/dist/**'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,vue,ts}', 'eslint.config.js'],
    extends: [
      ...standardjs.configs.base,
      ...tseslint.configs.recommended,
      ...pluginVue.configs['flat/strongly-recommended']
    ],
    rules: {
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/singleline-html-element-content-newline': [
        'error',
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ['pre', 'textarea', 'div'],
          externalIgnores: []
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
])
