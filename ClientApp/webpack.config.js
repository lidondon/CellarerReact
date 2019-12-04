var webpack = require('webpack');
//var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var path = require('path');

var SRC_DIR = path.resolve(__dirname, 'src');
var BUILD_DIR = path.resolve(__dirname, '../wwwroot');

var config = {
  mode:"development",
  entry: { 
    app: SRC_DIR + '/app.js'
  },
  devServer: {
    apiHistoryFallback: true,
  },
  output: {
    path: BUILD_DIR,
    filename: "[name].js",
    publicPath: '/',
    crossOriginLoading: "anonymous"
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        use : ['babel-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|png|jpg)$/,
        use: [
          { loader: 'file-loader' }
        ]
      }
    ]
  }
};

module.exports = config;