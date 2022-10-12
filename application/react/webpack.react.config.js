const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
  },
  entry: './src/app.tsx',
  target: 'node',
  target: 'web',
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    }),
  ],
};