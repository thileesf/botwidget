path = require('path');
const webpack = require('webpack');

module.exports = {
 devtool: 'eval',
 entry: './script',
 output: {
   path: path.join(__dirname, 'dist'),
   filename: 'script.js'
 },

 module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /\.scss$/,
      loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap']
    }
  ]
}
};
