import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginImport from 'eslint-plugin-import'
import { standard } from './eslint.standard.mjs'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.history/**']
  },
  { files: ['**/*.{js,mjs,cjs,vue}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: {
      import: pluginImport
    }
  },
  {
    rules: {
      ...standard.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      'quote-props': ['error', 'consistent']
    }
  }
]
