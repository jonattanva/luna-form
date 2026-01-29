import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintTypeScript from 'typescript-eslint'
import eslintignore from './eslintignore.mjs'
import globals from 'globals'

export const baseConfig = [
  eslintignore,
  ...eslintTypeScript.configs.recommended,
]

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
