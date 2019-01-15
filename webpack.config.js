const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  module: {
      rules: [{
        test: /\.go/,
        use: [{
            loader: path.join(__dirname, 'loaders', 'golang-simple.js'),
            //loader: path.join(__dirname, 'loaders', 'golang.js'),
            options: {
                GOPATH: process.env.GOPATH,
                GOROOT: process.env.GOROOT
            }
        }]
      }]
  }, 
  node: {
    "fs": "empty"
  }
};
