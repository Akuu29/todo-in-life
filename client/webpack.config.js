const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    top: path.join(__dirname, "src", "clientTop.tsx"),
    signup: path.join(__dirname, "src", "clientSignup.tsx"),
    login: path.join(__dirname, "src", "clientLogin.tsx"),
    todos: path.join(__dirname, "src", "clientTodos.tsx")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    static: {
      directory: "./bundle",
    }
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "/bundle"),
  },
  performance: {
    maxEntrypointSize: 600000,
    maxAssetSize: 600000,
  },
};