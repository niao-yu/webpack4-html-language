const webpack = require('webpack')
process.env.NODE_ENV = 'production'
const path = require('path')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin') // 用于在构建前清除dist目录中的内容
const webpackConfig = require('./webpack.config')
const ora = require('ora') // 在终端显示文字/图标的插件

const { BUILD } = require('../config/index')


// 清除dist构建目录文件
let config = merge(webpackConfig, {
  mode: 'production',
  devtool: BUILD.devtool,
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
      root: path.resolve(__dirname, '../'),
      verbose: true,
    }),
    new webpack.DefinePlugin({ // 插入编译后代码中的全局变量
      'NODE_ENV': JSON.stringify('production'),
    }),
  ],
})

const spinner = ora('building for production...')
spinner.start()

webpack(config, function(err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    compress: true, // 是否启用gzip压缩
    chunks: false,
    clientLogLevel: 'none',
    chunkModules: false,
  }) + '\n')
  console.log('\n\n')
  console.log('\x1B[36m', 'Build complete.')
  console.log('\x1B[33m%s\x1b[0m', 'Tip: built files are meant to be served over an HTTP server.')
  console.log('\x1B[33m%s\x1b[0m', 'Opening index.html over file:// won\'t work.')
})