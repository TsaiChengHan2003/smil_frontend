import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import babelParser from '@babel/eslint-parser'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist', 'node_modules'],

    languageOptions: {
      parser: babelParser, // ✅ 使用 Babel parser
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }], // ✅ 告訴 Babel 使用新 JSX transform
          ],
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      env: {
        browser: true,
        es2021: true,
      },
      globals: {
        window: true,
        document: true,
        console: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        localStorage: true,
        sessionStorage: true,
        process: true,
        useForm: true,
      },
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
      'import/resolver': {
        alias: {
          map: [
            ['@', path.resolve(__dirname, './src')],
            ['@/', `${path.resolve(__dirname, './src')}/`], // ✅ 支援 '@/...' 的寫法
            ['@components', path.resolve(__dirname, './src/components')],
            ['@assets', path.resolve(__dirname, './src/assets')],
            ['@styles', path.resolve(__dirname, './src/assets/styles')],
            ['@hooks', path.resolve(__dirname, './src/hooks')],
            ['@utils', path.resolve(__dirname, './src/utils')],
          ],
          extensions: ['.js', '.jsx', '.json', '.scss'],
        },
        node: {
          paths: [path.resolve(__dirname, './src')],
          extensions: ['.js', '.jsx', '.json', '.scss'],
        },
      },
    },

    rules: {
      // ✅ 真正會抓「沒 import 的 <Component />」
      'react/jsx-no-undef': 'error',

      // 其他 React / Hooks
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // import
      'import/no-unresolved': ['error', { caseSensitive: false }],
      'import/order': 'off',

      // 其它雜項
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-case-declarations': 'off',

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
