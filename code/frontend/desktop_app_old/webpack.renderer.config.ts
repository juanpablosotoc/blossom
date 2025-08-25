import path from 'path';
import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.svg', '.jpg'],
    alias: {
      '@myComponents': path.resolve(__dirname, 'src/renderer/components/'),
      '@myTypes': path.resolve(__dirname, 'src/types/'),
      '@myAssets': path.resolve(__dirname, 'src/renderer/assets/'),
      '@myUtils': path.resolve(__dirname, 'src/renderer/utils/'),
      '@myFrames': path.resolve(__dirname, 'src/renderer/frames/'),
      '@myPages': path.resolve(__dirname, 'src/renderer/pages/'),
    }
  },
};
