const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");
const path = require("path");

module.exports = merge(base, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: [
      path.resolve(__dirname, "dist"),
      path.resolve(__dirname, "public")
    ],
    host: "localhost",
    port: 8080,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  }
});
