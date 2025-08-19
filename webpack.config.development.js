const config = require('./webpack.config.base');

config[0].mode = 'development';
config[1].mode = 'development';

module.exports = config;
