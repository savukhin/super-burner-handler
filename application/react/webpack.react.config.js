const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
  },
  entry: './src/index.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devServer: {
    static: {
        directory: path.join(__dirname, '../electron/dist/renderer'),
    },
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000,
    devMiddleware: {
        publicPath: '/',
    },
    historyApiFallback: { index: "index.html" }
  },
  output: {
    path: path.resolve(__dirname, '../electron/dist/renderer'),
    filename: 'js/[name].js',
    publicPath: './',
    libraryTarget: 'umd',
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    }),
  ],
};