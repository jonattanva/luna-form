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
// `date-fns` and `date-fns/locale` re-export every function and every locale.
// A bundler drops what is unused; Node does not, so on a server or in a test
// they load all of it for the few a form uses. Each one has its own path.
const DATE_FNS_MESSAGE =
  'Import each date-fns function or locale by its own path, such as ' +
  "'date-fns/format' or 'date-fns/locale/es'."

export const librarySourceConfig = {
  files: ['packages/*/src/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
  rules: {
    'max-params': ['error', 4],
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'date-fns',
            allowTypeImports: true,
            message: DATE_FNS_MESSAGE,
          },
          {
            name: 'date-fns/locale',
            allowTypeImports: true,
            message: DATE_FNS_MESSAGE,
          },
        ],
      },
    ],
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
