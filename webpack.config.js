module.exports = {
  entry: './dev_env.js',
  output: {
    filename: 'dev_env.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
