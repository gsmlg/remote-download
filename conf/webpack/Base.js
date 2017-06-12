'use strict';
const fs = require('fs');
const path = require('path');
const appRoot = path.join(__dirname, '..', '..');
const npmBase = path.join(appRoot, 'node_modules');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var scssSyntax = require('postcss-scss');
var autoprefixer = require('autoprefixer');

class WebpackBaseConfig {
  constructor() {
    this._config = {};
  }
  get includedPackages() {
    return [].map(pkg => fs.realpathSync(path.join(npmBase, pkg)));
  }
  set config(data) {
    let {plugins} = data;
    if (plugins) {
      data.plugins = this.defaultSettings.plugins.concat(plugins);
    }
    this._config = Object.assign({}, this.defaultSettings, data);
    return this._config;
  }
  get config() {
    return this._config;
  }
  get env() {
    return 'dev';
  }
  get srcPathAbsolute() {
    return path.join(appRoot, 'client');
  }
  get testPathAbsolute() {
    return path.resolve('./test');
  }
  get defaultSettings() {
    return {
      context: this.srcPathAbsolute,
      devtool: 'eval',
      devServer: {
        contentBase: './client/',
        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 3000
      },
      entry: {
        app: path.join(appRoot, 'client/client')
      },
      module: {
        rules: [
          {
            test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|eot|otf|ttf)/,
            use: [
              'file-loader'
            ]
          },
          {
            test: /\.(js|jsx)$/,
            include: [].concat(this.includedPackages, [this.srcPathAbsolute]),
            use: [
              {
                loader: 'babel-loader',
                options: {
                  plugins: [

                  ],
                  presets: [
                    'es2015',
                    'react'
                  ]
                }
              }
            ]
          },
          {
            test: /\.(sass|scss)$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'resolve-url-loader',
                  options: {
                    debug: true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    syntax: 'postcss-scss',
                    plugins: () => {
                      return [
                        autoprefixer()
                      ];
                    }
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    // includePaths: [
                    //   this.srcPathAbsolute,
                    //   'node_modules'
                    // ]
                  }
                }
              ]
            })
          },
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'resolve-url-loader'
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: () => {
                      return [
                        autoprefixer()
                      ];
                    }
                  }
                }
              ]
            })
          },
        ]
      },
      output: {
        path: path.join(appRoot, 'build'),
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkHash].js',
        publicPath: '/'
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.join(appRoot, 'client/index.html'),
          filename: 'index.html'
        }),
        new ExtractTextPlugin('[name]-[hash].css'),
      ],
      resolve: {
        alias: {
          actions: `${ this.srcPathAbsolute }/actions/`,
          components: `${ this.srcPathAbsolute }/components/`,
          config: `${ this.srcPathAbsolute }/config/${ this.env }.js`,
          images: `${ this.srcPathAbsolute }/images/`,
          sources: `${ this.srcPathAbsolute }/sources/`,
          stores: `${ this.srcPathAbsolute }/stores/`,
          styles: `${ this.srcPathAbsolute }/styles/`
        },
        extensions: [
          '.js',
          '.jsx'
        ],
        modules: [
          this.srcPathAbsolute,
          'node_modules'
        ]
      },
    };
  }
}
module.exports = WebpackBaseConfig;
