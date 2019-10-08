const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = async ({ config, mode }) => {
  config.resolve.extensions.push('.ts', 'tsx');
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.tsx?$/,
      use: {
        loader: 'babel-loader',
      },
      exclude: /node_modules/,
    },
    {
      test: /\.scss$/,
      oneOf: [
        {
          resourceQuery: /module/,
          use: [
            {
              loader: 'vue-style-loader',
              options: {
                sourceMap: false,
                shadowMode: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
        {
          resourceQuery: /\?vue/,
          use: [
            {
              loader: 'vue-style-loader',
              options: {
                sourceMap: false,
                shadowMode: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
        {
          test: /\.module\.\w+$/,
          use: [
            {
              loader: 'vue-style-loader',
              options: {
                sourceMap: false,
                shadowMode: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
        {
          use: [
            {
              loader: 'vue-style-loader',
              options: {
                sourceMap: false,
                shadowMode: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
              },
            },
          ],
        },
      ],
    },
    {
      test: /\.pug$/,
      oneOf: [
        {
          resourceQuery: /vue/,
          use: [
            {
              loader: 'pug-plain-loader',
            },
          ],
        },
        {
          use: [
            {
              loader: 'raw-loader',
            },
            {
              loader: 'pug-plain-loader',
            },
          ],
        },
      ],
    },
    {
      test: /styles\/icons\/icons.svg$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'icons.svg',
          },
        },
      ],
    },
  ];
  
  return config;
};