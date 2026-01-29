import eslintReact from 'eslint-plugin-react'
import eslintReactHooks from 'eslint-plugin-react-hooks'
import eslintReactRefresh from 'eslint-plugin-react-refresh'
import {
  baseConfig,
  tsWithJsxA11yConfig,
  eslintTypeScript,
  globals,
} from '../../.config/eslint-base.mjs'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...baseConfig,
  tsWithJsxA11yConfig(import.meta.dirname),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: eslintTypeScript.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...eslintTypeScript.configs.recommendedTypeChecked[1].rules,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs.flat.recommended,
    languageOptions: {
      ...eslintReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/no-unescaped-entities': 'warn',
      'react/no-unstable-nested-components': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/destructuring-assignment': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])
