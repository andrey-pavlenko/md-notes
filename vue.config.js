const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const copyNotes = process.env.NODE_ENV !== 'production'
    ? new CopyPlugin([
        {
          from: path.resolve(__dirname, 'src/notes'),
          to: path.resolve(__dirname, 'dist/notes'),
        },
      ])
    : null;

const plugins = [copyNotes].filter(plugin => !!plugin);

module.exports = {
  publicPath: './',
  configureWebpack: {
    resolve: {
      extensions: ['.ts', 'tsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader'
          },
          exclude: /node_modules/
        },
        {
          test: /styles\/icons\/icons.svg$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'icons.svg'
              }
            }
          ]
        }
      ]
    },
    plugins: plugins
  },
  productionSourceMap: false
};
