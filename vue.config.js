const path = require('path');
const webpack = require('webpack');
const globalVars = require('./src/css/var.js');

module.exports = {
  lintOnSave: false,
  pages: {
    index: {
      entry: 'src/app.js',
      template: 'index.html',
      filename: 'index.html',
      favicon: path.resolve(__dirname, 'src/images/logo.ico'),
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  css: {
    loaderOptions: {
      less: {
        globalVars
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        model: path.resolve(__dirname, 'src/js/model/'),
        js: path.resolve(__dirname, 'src/js/'),
        components: path.resolve(__dirname, 'src/components/'),
        src: path.resolve(__dirname, 'src/')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        Utils: [path.resolve(__dirname, 'src/js/common/utils'), 'default'],
        Manba: 'manba',
        HeyUI: 'heyui',
        Model: 'js-model',
        G: 'hey-global',
        log: 'hey-log',
      })
    ]
  },
  // devServer: {
  //   proxy: {
  //     // 此处应该配置为开发服务器的后台地址
  //     // 配置文档： https://cli.vuejs.org/zh/config/#devserver-proxy
  //     '/api': {
  //       target: 'http://127.0.0.1:10000/',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '/'
  //       }
  //     }
  //   }
  // }
};
