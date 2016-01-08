// Dev-server that is accepts component to wrap as the third argument.
// Starts a webpack dev server on port 3000
var component_to_render = process.argv[2]
if (component_to_render === undefined) {
  throw new Error('You need to specify which component to render!')
}
var WebpackDevServer = require('webpack-dev-server')
var compiler = require('./lib/compiler.js')(component_to_render)

var port = process.env.PORT || 3000

new WebpackDevServer(compiler, {
  contentBase: __dirname + '/public',
  publicPath: '/',
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  }
}).listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`Listening at http://localhost:${port}`)
})
