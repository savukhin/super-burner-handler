const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  entry: './main.ts',
  target: 'electron-main',
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
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
};
