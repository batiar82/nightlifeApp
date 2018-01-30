// webpack.config.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.join(__dirname,'src','app.js'),
  output: {
    path: path.join(__dirname,'public', 'js'),
    filename: 'bundle.js'
  },
  watch: true,
  module: {
    loaders: [{
      test: path.join(__dirname, 'src'), //Creo que me dice de donde saca los archivos
      loader: 'babel-loader',
      options: {
        cacheDirectory: 'babel_cache',
        presets: ['react', 'es2015']
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
   // new webpack.optimize.DedupePlugin(),
   new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    })
  ]
};