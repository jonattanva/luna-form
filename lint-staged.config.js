module.exports = {
  'packages/luna-react/**/*.{mjs,ts,tsx}': [
    'prettier --write',
    'eslint -c packages/luna-react/eslint.config.mjs --fix',
  ],
  'packages/luna-core/**/*.{mjs,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,css,html,yml}': ['prettier --write'],
  // A change that touches only the registry skips CI (`paths-ignore` in
  // build-and-test.yml), so its formatting is checked here or not until the
  // next change that runs code.
  'audit/**/*.js': ['prettier --write'],
}
