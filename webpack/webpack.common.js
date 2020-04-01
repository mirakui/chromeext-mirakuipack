const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";

module.exports = {
  entry: {
    popup: path.join(__dirname, srcDir + "popup.ts"),
    options: path.join(__dirname, srcDir + "options.ts"),
    background: path.join(__dirname, srcDir + "background.ts"),
    content_script: path.join(__dirname, srcDir + "content_script.ts"),
    amazon_shortener: path.join(__dirname, srcDir + "amazon_shortener.ts"),
    remove_query_strings: path.join(
      __dirname,
      srcDir + "remove_query_strings.ts"
    ),
    zoom_closer: path.join(__dirname, srcDir + "zoom_closer.ts")
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial"
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyPlugin([{ from: ".", to: "../" }], { context: "public" })
  ]
};
