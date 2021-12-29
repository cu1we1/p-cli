const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			"@": path.resolve(__dirname, "src"),
		}
	},
	entry: {
		index: "./src/index.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name]-[hash].bundle.js",
		publicPath: "",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{ loader: 'file-loader' }
				]
			}
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "public/index.html"),
			filename: "index.html",
			chunks: ["index"],
		})
	],
};
