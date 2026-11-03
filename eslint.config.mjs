import eslintPlaywright from 'eslint-plugin-playwright'
import {
  baseConfig,
  librarySourceConfig,
  tsWithJsxA11yConfig,
} from './.config/eslint-base.mjs'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...baseConfig,
  tsWithJsxA11yConfig(import.meta.dirname),
  librarySourceConfig,
  {
    ...eslintPlaywright.configs['flat/recommended'],
    files: ['tests/e2e/**'],
    rules: {
      ...eslintPlaywright.configs['flat/recommended'].rules,
    },
  },
])
