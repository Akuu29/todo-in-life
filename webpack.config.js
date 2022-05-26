const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    index: path.join(__dirname, "static/js", "index.tsx"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    static: {
      directory: "./static/bundle",
    }
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "static/bundle"),
  }
};