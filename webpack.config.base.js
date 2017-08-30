var config = {
  entry: [
    './app/index',
  ],
  module: {
    loaders: [{
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
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};

module.exports = config;
