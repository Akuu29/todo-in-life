const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    index: path.join(__dirname, "static/js", "client_index.tsx"),
    signup: path.join(__dirname, "static/js", "client_signup.tsx"),
    login: path.join(__dirname, "static/js", "client_login.tsx"),
    app: path.join(__dirname, "static/js", "client_app.tsx")
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