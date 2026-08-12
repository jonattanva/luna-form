module.exports = {
  'packages/luna-react/**/*.{mjs,ts,tsx}': [
    'prettier --write',
    'eslint -c packages/luna-react/eslint.config.mjs --fix',
  ],
  'packages/luna-core/**/*.{mjs,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,css,html,yml}': ['prettier --write'],
}
