const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const srcPath = './src';
const path = require( 'path' );

const plugins = [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
];

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
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            }),
        ]
    },
    plugins: plugins
};