const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

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
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash].bundle.js",
    publicPath: ""
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
    new HtmlWebpackPlugin({
      title: "全搜结果页",
      template: "./public/medusa.html",
      filename: "medusa.html",
      chunks: ["medusa"]
    }),
    new HtmlWebpackPlugin({
      title: "全搜二级页",
      template: "./public/zeus.html",
      filename: "zeus.html",
      chunks: ["zeus"]
    }),
    new VueLoaderPlugin()
  ]
};
