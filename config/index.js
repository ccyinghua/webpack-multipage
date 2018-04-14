'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env'),  // 引入当前目录下的dev.env.js，用来指明开发环境
    port: 3000,  // dev-server的端口号，可以自行更改
    autoOpenBrowser: true,  // 是否自定代开浏览器

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 下面是代理表，作用是用来，建一个虚拟api服务器用来代理本机的请求，只能用于开发模式
    proxyTable: {
        "/demo/api":"http://localhost:8080"
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    
    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    // 是否生成css，map文件，上面这段英文就是说使用这个cssmap可能存在问题，但是按照经验，问题不大，可以使用
    cssSourceMap: false
  },

  build: {
    env: require('./prod.env'),  // 导入prod.env.js配置文件，只要用来指定当前环境

    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),  // 相对路径的拼接
    
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),  // 静态资源的根目录 也就是dist目录
    assetsSubDirectory: 'static',  // 静态资源根目录的子目录static，也就是dist目录下面的static
    assetsPublicPath: '/',   // 静态资源的公开路径，也就是真正的引用路径
    
    /**
     * Source Maps
     */
    productionSourceMap: true,   // 改成false运行时不会出现map调试文件。;是否生成生产环境的sourcmap，sourcmap是用来debug编译后文件的，通过映射到编译前文件来实现
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',


    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,  // 是否在生产环境中压缩代码，如果要压缩必须安装compression-webpack-plugin
    productionGzipExtensions: ['js', 'css'],  // 定义要压缩哪些类型的文件
    

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 下面是用来开启编译完成后的报告，可以通过设置值为true和false来开启或关闭
    // 下面的process.env.npm_config_report表示定义的一个npm_config_report环境变量，可以自行设置
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
