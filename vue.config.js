let ip = process.env.VUE_APP_IP
let outputDir = process.env.OUTPUT_DIR
let assetsDir = process.env.ASSETS_DIR
let indexPath = process.env.INDEX_PATH

const version = new Date().getTime();

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserWebpackPlugin = require("terser-webpack-plugin");
const isProduction = process.env.NODE_ENV === 'production'
const path = require('path')
const webpack = require("webpack");

module.exports = {
  lintOnSave: false, // 关闭eslint
  publicPath:'./',
  outputDir: outputDir, // 输出文件目录
  assetsDir: assetsDir,
  indexPath: indexPath,
  // 去除生产环境的productionSourceMap
  productionSourceMap: false,
  chainWebpack: config => {
    // webpack 会默认给commonChunk打进chunk-vendors，所以需要对webpack的配置进行delete
    config.optimization.delete('splitChunks')
    // prefetch，此插件是用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容
    config.plugins.delete("prefetch")
    // if (!isProduction) {
    //   config.plugin('webpack-bundle-analyzer')
    //       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // }
  },
  css: {
    loaderOptions:{
      sass:{
        additionalData:'@import "@/styles/themes.scss";'
      }
    },
    // 是否使用css分离插件 ExtractTextPlugin
    extract: {
      // 修改打包后css文件名   // css打包文件，添加时间戳
      filename: `assert/css/str[name].[chunkhash].${version}.css`,
      chunkFilename: `assert/css/str[name].[chunkhash].${version}.css`
    }
  },
  configureWebpack: {
    output: isProduction ?  { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `assert/js/str[name].[chunkhash].${version}.js`,
      chunkFilename: `assert/js/str[id].[chunkhash].${version}.js`
    } : {},
    // 开启分离js
    optimization: isProduction ? {
      runtimeChunk: 'single',
      splitChunks: {
        // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
        chunks: 'all',
        maxInitialRequests: Infinity,
        // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
        minSize: 1000 * 60,
        // 表示按需加载文件时，并行请求的最大数目。默认为5。
        maxAsyncRequests: 5,
        // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
        automaticNameDelimiter: '~',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // 排除node_modules 然后吧 @ 替换为空 ,考虑到服务器的兼容
              const match = module.context && module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'default-package-name';
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    } : {},
    // 取消webpack警告的性能提示
    performance: isProduction ? {
      hints: 'warning',
      //入口起点的最大体积
      maxEntrypointSize: 1000 * 500,
      //生成文件的最大体积
      maxAssetSize: 1000 * 1000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js');
      }
    } : {},
    plugins: isProduction ? [
      // 只打包改变的文件 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
      new webpack.ids.HashedModuleIdsPlugin({
        context: __dirname,
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20,
      }),
      // nginx也要开启压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(js|css)$/,// 匹配文件名
        threshold: 10000, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 不删除源文件
        minRatio: 0.8 // 压缩比
      }),
      new TerserWebpackPlugin ()
    ]: [],
    module: {
      rules: [
        {
          test: path.resolve(__dirname, 'node_modules/leader-line/'),
          use: [
            {
              // 解决leader-line报错问题
              loader: 'skeleton-loader',
              options: {
                procedure: content => `${content}export default LeaderLine`
              }
            }
          ]
        }
      ]
    }
  },
  // 配置代理
  devServer:{
    port:8089,
    open: true,
    proxy:{
      '/api':{
        target:'http://' + ip,
        changeOrigin: true,
        pathRewrite:{
          '^/api':''   //请求的时候使用这个api就可以
        }
      }
    }
  }
}
