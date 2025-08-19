const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mainConfig = {
  target: 'electron-main',
  entry: './main.js',
  output: {
    filename: 'main.bundle.js',
    path: `${__dirname}/build`,
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externalsPresets: { node: true },
  resolve: {
    extensions: ['.js'],
  },
  externals: {
    ssh2: 'commonjs ssh2',
  },
};

const rendererConfig = {
  target: 'web',
  entry: './app/index',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
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
    new MiniCssExtractPlugin({
      filename: 'style.css',
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

module.exports = [mainConfig, rendererConfig];
