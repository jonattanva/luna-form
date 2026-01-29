module.exports = {
  'packages/luna-react/**/*.{mjs,ts,tsx}': [
    'prettier --write',
    'eslint -c packages/luna-react/eslint.config.mjs --fix',
  ],
  'packages/luna-svelte/**/*.{mjs,ts,tsx,svelte}': [
    'prettier --write',
    'eslint -c packages/luna-svelte/eslint.config.mjs --fix',
  ],
  '!(packages)/**/*.{mjs,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,css,html,yml}': ['prettier --write'],
}
