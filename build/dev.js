const webpack = require('webpack')
process.env.NODE_ENV = 'development'
const path = require('path')
const merge = require('webpack-merge')
const webpackConfig = require('./webpack.config')
const portfinder = require('portfinder') // 获取可用端口
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') // 更友好的打印提示插件
const packageConfig = require('../package.json') // 更友好的打印提示插件

const { DEV } = require('../config/index')


module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = DEV.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 提示 端口port发生变化, 使用的黄色, 其他颜色参考 https://blog.csdn.net/autumn84/article/details/44816947 , 或者使用插件 colors
      if (port != DEV.port) console.log('\x1B[33m%s\x1b[0m', `The port has changed: ${DEV.port} => ${port}`)
      let devConfig = merge(webpackConfig, {
        devtool: DEV.devtool,
        mode: 'development',
        // 前台开发本地服务插件
        devServer: {
          contentBase: path.resolve(__dirname, '../dist'), //路径(注意:加点-此路径为相对 output 的相对路径;不加点:此盘的绝对路径)
          publicPath: DEV.assetsPublicPath,
          host: DEV.host || '0.0.0.0',
          port: port, // 端口
          hot: false, // 热更新
          progress: true, // 显示打包进度
          compress: true, // 服务器压缩式，一般为true
          inline: true, // 实时刷新
          clientLogLevel: 'warning', // 浏览器控制台打印信息的级别 'info' 'warning' 'error' 'none'
          overlay: { warnings: false, errors: true }, // 控制错误消息提示显示在页面上
          open: DEV.autoOpenBrowser, // 服务启动,自动打开浏览器
          quiet: true, // necessary for FriendlyErrorsPlugin
          // watchOptions: {
          //   aggregateTimeout: 300,
          //   poll: true
          // },
        },
        plugins: [
          new webpack.DefinePlugin({ // 插入编译后代码中的全局变量
            'NODE_ENV': JSON.stringify('development'),
          }),
          new webpack.HotModuleReplacementPlugin(), // hot热更新需要
          new FriendlyErrorsPlugin({ // 编译完成提示
            compilationSuccessInfo: {
              messages: [`Your application is running here: http://localhost:${port}`],
            },
            onErrors: (severity, errors) => {
              if (severity !== 'error') return
              const notifier = require('node-notifier')
              const error = errors[0]
              const filename = error.file && error.file.split('!').pop()
              notifier.notify({
                title: packageConfig.name,
                message: severity + ': ' + error.name,
                subtitle: filename || '',
                icon: path.join(__dirname, 'logo.png'),
              })
            },
          }),
        ],
      })
      resolve(devConfig)
    }
  })
})