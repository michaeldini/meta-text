import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import noDirectHeroicons from './scripts/eslint-rules/no-direct-heroicons.js'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        // Removed project reference for simplicity; add back if needing type-aware linting
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      react: reactPlugin,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tsPlugin,
      local: { rules: { 'no-direct-heroicons': noDirectHeroicons } },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      // Prefer TS-aware unused vars rule
      'no-unused-vars': 'off',
      // TS handles undefineds; avoid false positives on types
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Using React 17+ automatic JSX runtime
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'local/no-direct-heroicons': [
        'error',
        { registryPath: 'src/components/icons/registry.ts', sources: ['react-icons/hi2'] },
      ],
      // Enforce function declarations for React components; avoid React.FC
      'react/function-component-definition': ['error', {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression'
      }],
      // Disallow typing components as React.FC / React.FunctionComponent
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSTypeReference > TSQualifiedName[left.name="React"][right.name=/^(FC|FunctionComponent)$/] ',
          message: 'Avoid React.FC/React.FunctionComponent. Use function declarations with typed props.'
        },
        {
          selector: 'TSTypeReference > Identifier[name=/^(FC|FunctionComponent)$/]',
          message: 'Avoid FC/FunctionComponent. Use function declarations with typed props.'
        }
      ],
    },
  },
]
