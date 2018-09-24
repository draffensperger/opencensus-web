module.exports = {
  entry: './build/src/index.js',
  output: {
    filename: 'bundle/bundle.js',
  },
  mode: 'development',
  watch: true,
  devServer: {
    contentBase: 'dist/bundle/',
  },
};
