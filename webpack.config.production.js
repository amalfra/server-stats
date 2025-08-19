const config = require('./webpack.config.base');

config[0].mode = 'production';
config[1].mode = 'production';

module.exports = config;
