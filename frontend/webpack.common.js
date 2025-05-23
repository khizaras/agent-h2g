const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");

// Get the root path (assuming your webpack config is in the root of your project)
const rootPath = path.resolve(__dirname);

// Create the fallback path (the frontend folder)
const frontendEnv = path.resolve(rootPath, ".env");

// Call dotenv and get access to the environment variables
let finalEnv = {};

// First, try to load the root .env file
if (fs.existsSync(path.resolve(path.join(__dirname, ".."), ".env"))) {
  const rootEnv = dotenv.config({
    path: path.resolve(path.join(__dirname, ".."), ".env"),
  }).parsed;
  finalEnv = { ...finalEnv, ...rootEnv };
}

// Then try to load the frontend .env file (it will override the root .env variables)
if (fs.existsSync(frontendEnv)) {
  const envConfig = dotenv.config({ path: frontendEnv }).parsed;
  finalEnv = { ...finalEnv, ...envConfig };
}

// Define environment variables
const envKeys = Object.keys(finalEnv || {}).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(finalEnv[next]);
  return prev;
}, {});

console.log("Environment Variables Loaded:", envKeys);

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["url-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    // Add DefinePlugin to make env variables available in the client
    new webpack.DefinePlugin(envKeys),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "../node_modules"),
    ],
  },
};
