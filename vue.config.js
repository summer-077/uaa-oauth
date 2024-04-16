const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    port: 8086,
    proxy: {
      '/dev': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/dev': ''
        }
      },
    }
  }
})
