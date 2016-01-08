// This file contains the webpack config and the component to render.
// TODO figure out a way to load 'loaders' from projects webpack config
var webpack = require('webpack')
var path = require('path')

module.exports = function (component_to_render) {
  return webpack({
    devtool: 'eval',
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:3000',
      'webpack/hot/only-dev-server',
      './bootstrap.js'
    ],
    context: __dirname,
    output: {
      path: __dirname + '../public',
      filename: 'bundle.js',
      publicPath: '/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __COMPONENT_TO_RENDER: JSON.stringify(component_to_render)
      })
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['react-hot', 'babel-loader'],
          exclude: /node_modules/,
          include: path.join(__dirname, '../')
        },
        {
          test: /\.scss$/,
          loader: 'style!css!sass'
        }
      ]
    }
  })
}
