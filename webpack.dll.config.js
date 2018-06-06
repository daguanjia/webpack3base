const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    vendor: ['jquery']
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    library: '[name]'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, './', '[name]-manifest.json'),
      // This must match the output.library option above
      name: '[name]'
    }),
  ],
}
