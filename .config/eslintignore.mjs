import { globalIgnores } from 'eslint/config'

export default globalIgnores([
  '.next',
  '.svelte-kit',
  '.turbo',
  'dist/',
  'examples/',
  'node_modules/',
  'packages/**/dist/',
])
