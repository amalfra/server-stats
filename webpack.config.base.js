import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mainConfig = {
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

export const rendererConfig = {
  target: 'web',
  entry: './app/index.jsx',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|__tests__|jest\.config\.js/,
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
