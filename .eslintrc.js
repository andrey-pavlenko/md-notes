module.exports = {
  root: true,

  extends: ['plugin:vue/essential', '@vue/prettier'],

  env: {
    browser: true,
    commonjs: true,
    es6: true
  },

  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    quotes: [2, 'single', { avoidEscape: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  }

  // plugins: ['@typescsript-eslint']
};