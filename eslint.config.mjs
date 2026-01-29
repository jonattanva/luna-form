import eslintPlaywright from 'eslint-plugin-playwright'
import { baseConfig, tsWithJsxA11yConfig } from './.config/eslint-base.mjs'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...baseConfig,
  tsWithJsxA11yConfig(import.meta.dirname),
  {
    ...eslintPlaywright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...eslintPlaywright.configs['flat/recommended'].rules,
    },
  },
])
