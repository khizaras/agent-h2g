const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "../build"),
    },
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
