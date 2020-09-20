var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  target: 'electron-main',
  entry: [
    './app/index',
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.png|\.svg$/,
      loader: 'file-loader'
    }, {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader']
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'url-loader'
    }]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'app/index.html', to: 'index.html' },
      ],
    }),
  ],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};

module.exports = config;
