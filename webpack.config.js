const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
// const manifest = require('./vendor-manifest.json')




module.exports = {
    entry: {
        index:'./js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     manifest
        // }),
        new extractTextPlugin('./css/index.[hash].css'),
        new CleanWebpackPlugin(
            ['dist'],　 //匹配删除的文件
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
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader",'postcss-loader']
                })
            },
            {
                test:/\.(htm|html)$/,
                use:["html-withimg-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:5000,
                        outputPath:'img/'
                    }
                }]      
            },
            {
                test: /\.less$/,
                use:extractTextPlugin.extract({
                    fallback:'style-loader',
                    use:["css-loader",'postcss-loader','less-loader'] 
                })  
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    }
};