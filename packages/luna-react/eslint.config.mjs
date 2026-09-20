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

// A family caches one atom per key for the life of the page: it never lets go
// on its own, and the release machinery that tried to make it -- four atoms, a
// call in `useStore` and a comment on the loop to avoid -- still left two of
// them growing. The atom belongs to whoever reads it. See `useEntryAtom`.
const FAMILY_MESSAGE =
  'A family keeps one atom per key for the life of the page. ' +
  'Make the atom in the component that reads it, with useMemo: see useEntryAtom.'

export default defineConfig([
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'jotai-family', message: FAMILY_MESSAGE },
            {
              name: 'jotai/utils',
              importNames: ['atomFamily'],
              message: FAMILY_MESSAGE,
            },
          ],
        },
      ],
    },
  },
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
      // The rules the installed plugin ships for the React Compiler. A
      // component that breaks one of them is a component the compiler leaves
      // unoptimized, so the build has to keep them all in green.
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/static-components': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/use-memo': 'error',
      'react-hooks/preserve-manual-memoization': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])
