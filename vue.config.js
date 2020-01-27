const { join } = require('path')

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    // Aliases configuration
    config.resolve.alias
      .set('node_modules', join(__dirname, 'node_modules'))
  }
}
