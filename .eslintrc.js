module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'eol-last':0,
    'space-before-function-paren':0,
    'no-irregular-whitespace':'off',//这禁止掉 空格报错检查
    'no-console':'off' //在这禁止掉console报错检查 
  }
}
