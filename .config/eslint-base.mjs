import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintTypeScript from 'typescript-eslint'
import eslintignore from './eslintignore.mjs'
import globals from 'globals'

export const baseConfig = [
  eslintignore,
  ...eslintTypeScript.configs.recommended,
]

// Rules for the library's own source, whichever config lints it: the root one
// for `luna-core`, its own for `luna-react`. A function that needs more than
// four parameters is usually handed data that belongs where it is computed;
// pass an object, or move the data.
export const librarySourceConfig = {
  files: ['packages/*/src/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
  rules: {
    'max-params': ['error', 4],
  },
}

export const tsWithJsxA11yConfig = (tsconfigRootDir) => ({
  files: ['**/*.{ts,tsx}'],
  ...eslintPluginJsxA11y.flatConfigs.recommended,
  languageOptions: {
    ...eslintPluginJsxA11y.flatConfigs.recommended.languageOptions,
    parser: eslintTypeScript.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir,
    },
    globals: {
      ...globals.browser,
    },
  },
})

export { eslintTypeScript, globals }
