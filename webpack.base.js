const path = require("path");
const fs = require("fs");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const json = fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8");
const { version, proportion, line, debug } = JSON.parse(json);
const env = {
  APP_VERSION: `${version}_${proportion}_${line}`,
  APP_SHOW_DEV_ELEMENTS: debug === "1"
};

module.exports = {
  resolve: {
    extensions: [".js", ".ts", ".vue"],
    alias: {
      src: path.resolve(__dirname, "src")
    }
  },
  entry: {
    medusa: "./src/medusa/main.js",
    zeus: "./src/zeus/main.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 100 * 1024
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "结果页",
      template: "./public/medusa.html",
      filename: "medusa.html",
      chunks: ["medusa"]
    }),
    new HtmlWebpackPlugin({
      title: "二级页",
      template: "./public/zeus.html",
      filename: "zeus.html",
      chunks: ["zeus"]
    }),
    new webpack.DefinePlugin({
      process: JSON.stringify({ env })
    })
  ]
};
