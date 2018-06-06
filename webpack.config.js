const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const manifest = require('./vendor-manifest.json')




module.exports = {
    entry: {
        index:'./js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest
        }),
        new CleanWebpackPlugin(
            ['dist/index.*.js'],　 //匹配删除的文件
            {
                root: __dirname,
                verbose:true,
                dry:false
            }
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template: 'index.html',
            minify:true,
            inject:true
        }),
        new UglifyJsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port:9090,
        host:'localhost',
        open:true,
        proxy:{

        },
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    }
};