const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 解析html插件
let CopyWebpackPlugin = require('copy-webpack-plugin') // 整体直接复制的插件
let ImageminPlugin = require('imagemin-webpack-plugin').default // 优化图片的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')  //处理css工具
const optimizeCss = require('optimize-css-assets-webpack-plugin') // css 压缩插件

const { defaultConfig, DEV, BUILD } = require('../config/index')

let js_arr = glob.sync(path.join(defaultConfig.entry, '/pages/**/index.js')) // js入口文件
let pages = glob.sync(path.join(defaultConfig.entry, '/pages/**/index.ejs')) // 页面口文件
let entry = {}
let HtmlWebpackPluginArr = []
// 遍历处理html的文件们
pages.forEach(value => {
  let name = value.match(/pages\/(.*)\/index.ejs$/)[1] // html放置名称(带有路径信息)
  let tempArr = value.split('/')
  let jsName = tempArr[tempArr.length - 2] // 获取应有的js的名字
  let temp = new HtmlWebpackPlugin({ // 解析html插件
    template: path.resolve(__dirname, value), // 路径
    filename: `${name}.html`, // 文件名:默认为index.html
    minify: { // 使用的功能
      removeAttributeQuotes: true, // 去除引号
      removeComments: true, // 去除注释
      removeEmptyAttributes: true, // 去除空属性
      collapseWhitespace: true, // 去除空格
    },
    chunks: ['vendors', 'commons', 'runtime', 'main', `${jsName}`], // 自动引入的js文件
    chunksSortMode: 'manual', // 设置引入js的文件, 按数组的顺序引入
  })
  HtmlWebpackPluginArr.push(temp)
})
// 遍历处理入口js们
js_arr.forEach(value => {
  let tempArr = value.split('/')
  let name = tempArr[tempArr.length - 2]
  entry[name] = [
    value,
  ]
})
entry['main'] = glob.sync(path.join(defaultConfig.entry, '/main.js'))

module.exports = {
  entry, // => {index: '...', homePage: '...', ...}
  output: {
    path: defaultConfig.output, // 加点为相对路径,否则为此盘的绝对路径
    publicPath: process.env.NODE_ENV === 'production' ? BUILD.assetsPublicPath : DEV.assetsPublicPath,
    filename: 'js/[name].[hash].js',
  },
  // 配置全局路径变量
  resolve: {
    extensions: ['.js'], // 引入可以不加后缀名
    alias: {
      '#': path.join(__dirname, '/util'),
      '@': path.join(__dirname, '../src'),
    },
  },
  // 加载器
  module: {
    rules: [
      { // eslint校验
        test: /\.js$/,
        enforce: 'pre', // 编译前检查
        exclude: /(node_modules)/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'), // 默认的错误提示方式
          },
        },
        include: defaultConfig.entry,
        // exclude: /node_modules/,
      },
      { // 编译 es6
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true', // 开启缓存将转译结果缓存至文件系统
      },
      { // 编译css
        test:/\.css$/,
        // exclude: /node_modules/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
          },
        }, 'css-loader', 'postcss-loader'],
      }, { // 编译sass
        test:/\.scss$/,
        // exclude: /node_modules/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../',
          },
        }, 'css-loader', 'postcss-loader', 'sass-loader'],
      }, { // 解析html文件中引入的img图片
        test: /\.(htm|html|ejs)$/,
        loader: 'html-withimg-loader',
      }, {
        test: /\.(ejs)$/,
        loader: 'ejs-loader',
      }, { // 解析通过css引入的图片
        test: /\.(jpg|jpeg|png|gif)$/,
        loader: 'url-loader?limit=1024&name=./imgs/[name].[hash].[ext]',
        // use: ['url-loader?limit=1024&name=./imgs/[name].[hash].[ext]'] // 带参数,可拆分入文件夹并设置大小
      },
      { // 解析字体图标
        test: /\.(woff|ttf|svg|eot|xttf|woff2)$/,
        use: 'file-loader?name=./fonts/[name].[hash].[ext]',
      },
    ],
  },
  // 插件
  plugins: [
    ...HtmlWebpackPluginArr, // html们
    new optimizeCss(), // css的压缩
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      // chunkFilename: 'styles.[contentHash:8].css'   //把css文件单独打包
    }),
    // 复制插件
    new CopyWebpackPlugin([
      {
        from: path.join(defaultConfig.entry, '../static'),
        to: path.join(defaultConfig.output, '/'),
        // ignore: '' // 忽略的文件
      },
    ]),
    new webpack.ProvidePlugin({ // 全局变量
      $: 'jquery',
      jQuery: 'jquery',
    }),
    // 图片优化插件
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', // 开发时不启用
      pngquant: { //图片质量
        quality: '95-100',
      },
    }),
  ],
  optimization: {
    minimize: true, //是否进行代码压缩
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          minSize: 30000,
          minChunks: 1,
          chunks: 'initial',
          priority: 1, // 该配置项是设置处理的优先级，数值越大越优先处理
        },
        commons: {
          test: /[\\/]src[\\/]common[\\/]/,
          name: 'commons',
          minSize: 30000,
          minChunks: 3,
          chunks: 'initial',
          priority: -1,
          reuseExistingChunk: true, // 这个配置允许我们使用已经存在的代码块
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
}
