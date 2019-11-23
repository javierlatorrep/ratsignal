const path = require('path')

const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader')

const exclude = [
  /node_modules/,
  /libs/,
  /extension/,
  /icons/,
]

module.exports = env => {
  const isDevelopment = env.EXTENSION_ENVIRONMENT !== 'production'
  const plugins = isDevelopment ? [new ChromeExtensionReloader()] : []

  return {
    mode: env.EXTENSION_ENVIRONMENT,
    entry: {
      background: './src/background/background.js',
      popup: [
        './src/popup/popup.html',
        './src/popup/popup.js'
      ]
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'extension/build')
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          include: [
            path.resolve(__dirname, './src')
          ],
          exclude,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              },
            },
            'extract-loader',
            {
              loader: 'html-loader',
              options: {
                minimize: !isDevelopment && false
              }
            }
          ],
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, './src'),
          ],
          exclude,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        }
      ]
    },
    plugins,
    watchOptions: {
      ignored: exclude
    }
  };
};
