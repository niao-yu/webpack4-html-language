module.exports = {
  root: true, // 作用的目录是根目录
  // parser: 'esprima', // 脚本解析,默认为 esprima
  parser: 'babel-eslint', // 脚本解析,默认为 esprima
  parserOptions: {
    sourceType: 'module' // 按照模块的方式解析
  },
  env: {
    browser: true, // 开发环境配置表示可以使用浏览器的方法
  },
  'globals': {
    // '$': false,
  },
  rules: { // 0-不验证；1-警告；2-错误
    // 自定义的规则
    'arrow-spacing': 2, // 箭头函数前后必须有空格
    'semi': [2, 'never'], // 行后是否需要分号
    'indent': [2, 2], // 缩进风格
    'new-parens': 2, // new时必须加小括号
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'quotes': [1, 'single'], // 引号,尽量使用单引号
    'no-var': 2, // 不允许使用var
    'space-before-function-paren': [2, 'never'], // 函数定义时括号前面要不要有空格
    'comma-dangle': [2, 'always-multiline'], // 一行的对象尾项无逗号，多行的必须有
    'no-mixed-spaces-and-tabs': [2, false], // 禁止混用tab和空格
    'no-trailing-spaces': 2, // 一行结束后面不要有空格
    'array-bracket-spacing': [2, 'never'], // 非空数组里面不能有多余的空格
    // 'eol-last': 2, //文件以单一的换行符结束
  }
}