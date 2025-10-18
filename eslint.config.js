import path from 'path'
import { fileURLToPath } from 'url'

import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist', 'node_modules'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true, js: true } },
      globals: { window: true, document: true, console: true }
    },

    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin,
    },

    settings: {
      react: { version: 'detect' },
      // 告訴 import plugin 要解析哪些副檔名
      'import/parsers': { '@babel/eslint-parser': ['.js', '.jsx'] },
      // ✅ alias 與 node 同時啟用，並加入 @styles
      'import/resolver': {
        alias: {
          map: [
            ['@', path.resolve(__dirname, './src')],
            ['@components', path.resolve(__dirname, './src/components')],
            ['@assets', path.resolve(__dirname, './src/assets')],
            ['@styles', path.resolve(__dirname, './src/assets/styles')],
            ['@hooks', path.resolve(__dirname, './src/hooks')],
            ['@utils', path.resolve(__dirname, './src/utils')],
          ],
          extensions: ['.js', '.jsx', '.json', '.scss'],
        },
        node: {
          // 讓 import plugin 也會從 src 當成根去找
          paths: [path.resolve(__dirname, './src')],
          extensions: ['.js', '.jsx', '.json', '.scss'],
        },
      },
    },

    rules: {
      // React / Hooks
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Import
      'import/no-unresolved': 'error',

      // 其他
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',

      // Prettier
      'prettier/prettier': [
        'warn',
        {
          printWidth: 100,
          semi: false,
          singleQuote: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          arrowParens: 'avoid',
          endOfLine: 'auto',
        },
      ],
    },
  },
]
