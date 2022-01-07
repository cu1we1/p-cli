const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".js", ".ts", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  entry: {
    medusa: "./src/pages/medusa/main.js",
    zeus: "./src/pages/zeus/main.js"
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
        use: [{ loader: "file-loader" }]
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
    })
  ]
};
