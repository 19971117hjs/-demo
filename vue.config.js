// module.exports = {
//   configureWebpack: (config) => {
//     config.module.rules.push({
//       test: /\.csv$/,
//       use: [{
//         loader: 'csv-loader', 
//       }]
//     })
//   }

// }






module.exports = {
  publicPath: '/xtest/', //基本路径
  outputDir: 'dist',
  productionSourceMap: false,
  assetsDir: 'static',
  filenameHashing: true,
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html", // 这里用来区分加载那个 html
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]

    }
  },
  // CSS 相关选项
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {}, // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    modules: false
  },
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      use: [{
        loader: 'csv-loader',
      }]
    })
  },
  // 配置 webpack-dev-server 行为。
  devServer: {
    port: 3001,
    open: true,
    proxy: 'http://localhost:8080'
  }
}
