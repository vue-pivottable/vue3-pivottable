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
      ...standardjs.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginVue.configs['flat/strongly-recommended']
    ],
    rules: {
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      '@stylistic/quote-props': ['error', 'consistent'],
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
      ]
    }
  }
])
