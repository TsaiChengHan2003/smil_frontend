import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  js.configs.recommended, // 相當於 eslint:recommended
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: true,
        document: true,
        console: true,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'],
            ['@components', './src/components'],
            ['@assets', './src/assets'],
            ['@hooks', './src/hooks'],
            ['@utils', './src/utils'],
          ],
          extensions: ['.js', '.jsx', '.json', '.scss'],
        },
      },
    },
    rules: {
      // 🔇 關掉煩人的提示
      'react/prop-types': 'off',
      'react/display-name': 'off',
      // 🧠 保留重要檢查
      'import/no-unresolved': 'error',
      'import/order': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
]
