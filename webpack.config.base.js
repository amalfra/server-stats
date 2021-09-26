const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  target: 'electron-main',
  entry: [
    './app/index',
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.png|\.svg$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'app/index.html', to: 'index.html' },
      ],
    }),
  ],
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

module.exports = config;
