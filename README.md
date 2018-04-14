## vue webpack多页面构建

> 项目运行

```javascript
下载项目之后

# 下载依赖
npm install

# 运行
npm run dev

http://localhost:3000/login.html
http://localhost:3000/index.html

```

#### 一、开发环境

node v6.11.0

#### 二、安装vue-cli脚手架

```javascript
npm install vue-cli@2.8.2 -g
```

#### 三、初始化项目

```javascript 
vue init webpack webpack-multipage  // 创建项目

cd webpack-multipage  // 进入webpack-multipage目录

npm install  // 下载依赖

npm run dev // 运行

```
![image](https://github.com/ccyinghua/webpack-multipage/blob/master/resource/1.jpg?raw=true)

`http://localhost:8080`

![image](https://github.com/ccyinghua/webpack-multipage/blob/master/resource/2.jpg?raw=true)

#### 四、修改配置支持多页面

将项目根目录`index.html`,`src下的文件`删除，重新调整的src结构目录：

```javascript
|-- src
    |-- assets
    |-- components
    |-- entry
        |-- index    // index模块
            |-- components
                |-- Hello.vue
            |-- router
                |-- index.js
            |-- index.html
            |-- index.js
            |-- index.vue
        |-- login    // login模块
            |-- login.html
            |-- login.js
            |-- login.vue
            
```

###### (1) 修改`build/util.js`,在文件最后添加

```javascript
# 先下载glob组件
npm install glob -D
```
将目录映射成配置。如`./src/entry/login/login.js`变成映射`{login: './src/entry/login/login.js'}`

```javascript
var glob = require('glob');
exports.getEntries = function (globPath) {
  var entries = {}
  glob.sync(globPath).forEach(function (entry) {
    var basename = path.basename(entry, path.extname(entry), 'router.js');
    entries[basename] = entry
  });
  return entries;
}
```
###### (2) 修改`build/webpack.base.conf.js`,找到entry属性,使用了`uitls.js`文件中新添加的方法getEntries，将entry中的js都映射成程序的入口

```javascript
module.exports = {
  entry: utils.getEntries('./src/entry/*/*.js'),
  ...
}
```

###### (3) 修改`build/webpack.dev.conf.js`

删除文件内原有的`HtmlWebpackPlugin`相关内容

```javascript
...
// https://github.com/ampedandwired/html-webpack-plugin
new HtmlWebpackPlugin({
  filename: 'index.html',
  template: 'index.html',
  inject: true
}),
...
```
在文件最后添加

```javascript
var pages = utils.getEntries('./src/entry/*/*.html')
for(var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
```

###### (4) 修改`build/webpack.prod.conf.js`

删除文件内原有的`HtmlWebpackPlugin`相关内容

```javascript
...
// generate dist index.html with correct asset hash for caching.
// you can customize output by editing /index.html
// see https://github.com/ampedandwired/html-webpack-plugin
new HtmlWebpackPlugin({
    filename: config.build.index,
    template: 'index.html',
    inject: true,
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
}),
...
```
在文件最后添加

```javascript
var pages = utils.getEntries('./src/entry/*/*.html')
for(var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    }),
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
```
###### (5)修改`config/index.js`


```javascript

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
```

```
assetsRoot：执行npm run build之后，项目生成的文件放到哪个目录中。vue生成的文件都是静态文件，可以放在nginx中，也可以放到Spring Boot项目的resources/static目录中。
assetsPublicPath：项目的根路径。注意，这个属性在build、dev两个环境都有，修改时，应该同时修改两处。
port：这里改成3000，这个是在开发时，webpack-dev-server运行的端口。
proxyTable：这个属性用于将请求转发到指定地址去。这里的配置意思是将所有以/demo/api开头的请求，都转发到http://localhost:8080地址。
```

#### 五、建立页面

index/index.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>index</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>

```
index/index.js

```javascript
import Vue from 'vue'
import IndexView from './index.vue'
import router from './router'

// import VueResource from 'vue-resource';  // 使用前先npm install vue-resource --save下载vue-resource
// Vue.use(VueResource);

new Vue({
  el: '#app',
  router,
  render: h => h(IndexView)
});

```
index/index.vue

```html
<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
</style>

```
index/router/index.js

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})

```
index/components/Hello.vue

```html
<template>
  <div>
    Hello {{ name }}
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "admin"
      }
    },
    mounted(){
      //this.$http.get("/demo/api/userinfo").then(resp =>{
      //  this.name = resp.data.data;
      //});
    }
  }
</script>

<style>
</style>

```
login/login.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>login</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>

```
login/login.js

```javascript
import Vue from 'vue'
import LoginView from './login.vue'

// import VueResource from 'vue-resource';
// Vue.use(VueResource);

new Vue({
  el: '#app',
  render: h => h(LoginView)
})

```
login/login.vue

```html
<template>
  <div>
    <form id="login-form">
      <label for="username">用户名：</label>
      <input type="text" id="username" name="username">

      <br>

      <label for="password">密码：</label>
      <input type="password" id="password" name="password"><br>

      <br>

      <button @click.prevent="submit">登录</button>
    </form>
  </div>
</template>

<script>
  export default {
    methods:{
      submit(){
        window.location = "/demo/index.html";
        //let formData = new FormData(document.getElementById("login-form"));

        //this.$http.post("/demo/api/login", formData).then(resp => {
        //  if (resp.data.status === 200){
        //    window.location = "/index.html";
        //  }else {
        //    alert(resp.data.desc);
        //  }
        //})
      }
    }
  }
</script>

<style>
</style>

```
#### 六、运行

http://localhost:3000/login.html

![image](https://github.com/ccyinghua/webpack-multipage/blob/master/resource/3.jpg?raw=true)

http://localhost:3000/index.html

![image](https://github.com/ccyinghua/webpack-multipage/blob/master/resource/4.jpg?raw=true)




