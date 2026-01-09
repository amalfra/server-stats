import { merge } from 'webpack-merge';

import { mainConfig, rendererConfig } from './webpack.config.base.js';

const newMainConfig = merge(mainConfig, {
  mode: 'development',
});
const newRendererConfig = merge(rendererConfig, {
  mode: 'development',
});

export default [newMainConfig, newRendererConfig];
