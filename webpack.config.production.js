import { merge } from 'webpack-merge';

import { mainConfig, rendererConfig } from './webpack.config.base.js';

const newMainConfig = merge(mainConfig, {
  mode: 'production',
});
const newRendererConfig = merge(rendererConfig, {
  mode: 'production',
});

export default [newMainConfig, newRendererConfig];
