module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    "eslint-config-prettier"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error"
  },
}
