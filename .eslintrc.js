// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-multiple-empty-lines': ['error', {
      max: 2,
      maxEOF: 2,
      maxBOF: 2
    }],
    'space-before-function-paren': 0,
    'semi': 0,
    'no-new': 0,
    'no-unused-vars': 0,
    'no-undef': 0,
    'eol-last': 0,
    'no-useless-return': 0,
    'new-cap': 0,
    'no-shadow-restricted-names': 0,
    'one-var': 0
  }
}
