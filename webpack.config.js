const path = require('node:path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const browser = process.env.BROWSER_TARGET || 'chrome';

module.exports = {
  devtool: 'source-map',
  entry: {
    popup: './src/popup',
    background: './src/background',
    content: './src/content',
    options: './src/options',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // CSS imported from src/ is bundled as a string (see src/types/css.d.ts).
        test: /\.css$/,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `dist/${browser}`),
    clean: true,
  },
  watch: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER_TARGET': JSON.stringify(browser),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `./manifest.${browser}.json`, to: 'manifest.json' },
        { from: 'static' },
        {
          from: 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin{,-ext}-wght-normal.woff2',
          to: 'assets/fonts/[name][ext]',
        },
        {
          // Phosphor icons: <i class="ph ph-gear"> (regular) and <i class="ph-fill ph-gear">.
          from: 'node_modules/@phosphor-icons/web/src/{regular,fill}/{style.css,*.woff2}',
          to: ({ absoluteFilename }) =>
            `assets/phosphor/${path.basename(path.dirname(absoluteFilename))}/[name][ext]`,
        },
      ],
    }),
  ],
};
