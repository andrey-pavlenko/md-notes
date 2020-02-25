// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const { HotModuleReplacementPlugin } = require('webpack');
const Pako = require('pako');
const { readFileSync } = require('fs');

function compressHelp() {
  const helpMarkdownPath = './src/components/help/help.md';
  const help = readFileSync(helpMarkdownPath);
  const uint8 = Pako.deflate(help);
  // eslint-disable-next-line no-undef
  return Buffer.from(uint8, 'binary').toString('base64');
}

const env = require('./env.development.json');
const helpMd = compressHelp();
console.info(helpMd);

// eslint-disable-next-line no-undef
module.exports = {
  entry: {
    bundle: ['./src/main.js']
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    // eslint-disable-next-line no-undef
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /options\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'env.__options_contentsUrl__',
          replace: env.__options_contentsUrl__
        }
      },
      {
        test: /Help\.svelte$/,
        loader: 'string-replace-loader',
        options: {
          search: '__help_md__',
          replace: helpMd
        }
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader-hot',
          options: {
            dev: true,
            emitCss: true,
            hotReload: true,
            hotOptions: {
              noPreserveState: false,
              optimistic: true
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: 'public',
    port: 8080,
    clientLogLevel: 'warning',
    hot: true,
    historyApiFallback: true,
    overlay: true,
    inline: true,
    index: 'index.html'
  },
  plugins: [new HotModuleReplacementPlugin()]
};
