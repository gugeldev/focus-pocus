const path = require('node:path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const browser = process.env.BROWSER_TARGET || 'chrome';

module.exports = {
  devtool: 'source-map',
  entry: {
    popup: './src/popup',
    background: './src/background',
    content: './src/content',
    options: './src/options',
    welcome: './src/welcome',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            // `import css from './x.css?raw'` is the file as a string, which is how the
            // focus screen gets its styles into a shadow root (see src/types/css.d.ts).
            resourceQuery: /raw/,
            type: 'asset/source',
          },
          {
            // Every other import goes through Tailwind and is extracted next to its
            // bundle (popup.css, options.css). `url: false` keeps the font URLs as written.
            use: [
              MiniCssExtractPlugin.loader,
              { loader: 'css-loader', options: { url: false } },
              'postcss-loader',
            ],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `dist/${browser}`),
    clean: true,
  },
  // The extension loads its files from disk, so the web download-size hints do not apply.
  performance: { hints: false },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER_TARGET': JSON.stringify(browser),
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `./manifest.${browser}.json`, to: 'manifest.json' },
        { from: 'static' },
        {
          from: 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin{,-ext}-wght-normal.woff2',
          to: 'assets/fonts/[name][ext]',
        },
      ],
    }),
  ],
};
