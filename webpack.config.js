const path = require("path");
const uglifyjs = require("uglifyjs-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    "agent": "./src/agent.ts",
    "agent.min": "./src/agent.ts",
  },
  mode: "development",
  output: {
    filename: "[name].js",
    library: "Agent",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "lib"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
				use: [
					{
						loader: "ts-loader",
						options: {}
					},
				],
				exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new uglifyjs({
      include: /\.min\.js$/,
      sourceMap: true,
      uglifyOptions: {
        compress: true,
        ecma: 8,
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
