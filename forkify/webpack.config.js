const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);

module.exports = {
  entry: [
    `babel-polyfill`,
    `./src/js/index.js`,
  ],
  output: {
    path: path.resolve(__dirname, `dist`), // Join current absolute path (__dirname) with the path we want our bundle to be in
    filename: `js/bundle.js` // Output file
  },
  devServer: {
    contentBase:`./dist` // This is what is served - we only want dist folder to be served (minimized etc)
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `./src/index.html`
    }),
  ],
  devtool: `inline-source-map`,
  module: {
    rules: [
      {
        test: /\.js/, // Test all files if they end in .js (regex)
        exclude: /node_modules/, // Dont apply Babel to folder (regex)
        use: {
          loader: `babel-loader`, // If its js file apply Babel loader
        }
      },
    ],
  },
}