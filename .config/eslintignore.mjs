import { globalIgnores } from 'eslint/config'

export default globalIgnores([
  '.next',
  '.turbo',
  'dist/',
  'examples/',
  'node_modules/',
  'packages/**/dist/',
])
