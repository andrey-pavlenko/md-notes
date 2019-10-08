const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

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
    plugins: [
      new CopyPlugin([
        {
          from: path.resolve(__dirname, 'src/notes'),
          to: path.resolve(__dirname, 'dist/notes')
        }
      ])
    ]
  },
  productionSourceMap: false
};
