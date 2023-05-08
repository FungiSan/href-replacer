const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const srcPath = './src';
const path = require( 'path' );

module.exports = {
    output: {
        publicPath: "",
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js',
        chunkFilename: "[name].chunk.js"
    },
    entry: {
        main: path.resolve(__dirname, `${srcPath}/js/main.js`),
        settings: path.resolve(__dirname, `${srcPath}/js/settings.js`)
    },
    resolve: {
        extensions: ['.js', '.jsx', 'es6']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js|\.jsx|\.es6$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
            }
        ],
    },
    optimization: {
        minimizer: [
            // we specify a custom TerserPlugin here to get source maps in production
            new TerserPlugin({
                parallel: true,
                terserOptions : {
                    compress: false,
                    ecma: 6,
                    mangle: true,
                    nameCache: null
                }
            }),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};