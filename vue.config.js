module.exports = {
    configureWebpack: (config) => {
      config.module.rules.push({
        test: /\.csv$/,
        use: [{
          loader: 'csv-loader', 
        }]
      })
    },
  
  }
