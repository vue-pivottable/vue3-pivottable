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
    files: ['**/*.vue'],
    languageOptions: {
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser'),
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      'vue': pluginVue,
      '@typescript-eslint': tseslint
    },
    rules: {
      // 필요시 규칙 추가
    }
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
