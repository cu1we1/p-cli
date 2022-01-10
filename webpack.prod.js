const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const base = require("./webpack.base");

const myOptimization = {
  runtimeChunk: "single",
  splitChunks: {
    chunks: "all",
    minSize: 25000,
    maxAsyncRequests: 20,
    maxInitialRequests: 20,
    cacheGroups: {
      common: {
        name: "chunk-vendors-common",
        test: /[\\/]node_modules[\\/]/,
        chunks: "initial",
        minChunks: 2,
        priority: 1,
        reuseExistingChunk: true
      },
      default: {
        name: "chunk-src-common",
        test: /[\\/]src[\\/]/,
        chunks: "all",
        minChunks: 2,
        priority: 1,
        reuseExistingChunk: true
      },
      sort: {
        name: "chunk-packages-sort",
        test: /[\\/]global-search-main[\\/]src[\\/]packages[\\/]/,
        // chunks: "all",
        chunks: "initial",
        priority: 3,
        enforce: true
      },
      lottieWeb: {
        name: "lottie-web",
        test: /[\\/]node_modules[\\/]lottie-web[\\/]/,
        chunks: "all",
        priority: 3,
        enforce: true
      },
      colorui: {
        name: "chunk-color-ui",
        test: /[\\/]node_modules[\\/]@oppo[\\/]colorui[\\/]/,
        chunks: "initial",
        priority: 3,
        enforce: true
      },
      vue: {
        name: "chunk-vue",
        test: /[\\/]node_modules[\\/]vue[\\/]/,
        chunks: "all",
        priority: 3,
        enforce: true
      },
      vuerouter: {
        name: "chunk-vue-router",
        test: /[\\/]node_modules[\\/]vue-router[\\/]/,
        chunks: "all",
        priority: 3,
        enforce: true
      }
    }
  }
};

module.exports = merge(base, {
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name]-[hash].bundle.js",
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" },
          {
            loader: "sass-resources-loader",
            options: {
              sourceMap: true,
              resources: path.resolve(
                __dirname,
                "node_modules/@cpc/lib-sass-bem/src/index.scss"
              )
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name]-[hash].css"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled"
    }),
    new HtmlWebpackPlugin({
      title: "结果页",
      template: "./public/medusa.html",
      filename: "medusa.html",
      chunks: [
        "chunk-vendors",
        "chunk-common",
        "chunk-vue",
        "chunk-color-ui",
        "chunk-packages-sort",
        "chunk-vendors-common",
        "chunk-src-common",
        "medusa",
        "runtime"
      ]
    }),
    new HtmlWebpackPlugin({
      title: "二级页",
      template: "./public/zeus.html",
      filename: "zeus.html",
      chunks: [
        "chunk-vendors",
        "chunk-common",
        "chunk-vue",
        "chunk-vue-router",
        "chunk-color-ui",
        "chunk-vendors-common",
        "chunk-src-common",
        "zeus",
        "runtime"
      ]
    })
  ],
  optimization: myOptimization
});
