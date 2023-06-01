module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['prettier', 'jest'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  ignorePatterns: ['**/lib/**', '**/node_modules/**', '**/test/**'],
};
