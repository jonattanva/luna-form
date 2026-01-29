import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import { baseConfig, tsWithJsxA11yConfig } from '../../.config/eslint-base.mjs'

export default [
  ...baseConfig,
  tsWithJsxA11yConfig(import.meta.dirname),
  prettier,
  ...svelte.configs.prettier,
]
