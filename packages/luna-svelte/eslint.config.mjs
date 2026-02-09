import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'
import { baseConfig, tsWithJsxA11yConfig } from '../../.config/eslint-base.mjs'

export default [
  ...baseConfig,
  tsWithJsxA11yConfig(import.meta.dirname),
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  prettier,
  ...svelte.configs['flat/prettier'],
]
