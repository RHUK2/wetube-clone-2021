const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const regeneratorRuntime = require('regenerator-runtime');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js');
const OUTPUT_DIR = path.join(__dirname, 'static');

const config = {
  plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],
  entry: ENTRY_FILE,
  mode: MODE,
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js'
  }
};
module.exports = config;
