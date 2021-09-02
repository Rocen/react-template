const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } =require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const GoodPlugin = require('./custom/goodPlugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        polyfills: './polyfills', 
        index: path.resolve(__dirname, './src/index.js')
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            exclude: /node_modules/,
            parallel: 4,
            minify:  TerserPlugin.uglifyJsMinify,
        })],
        splitChunks: {
            chunks: 'async'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                [
                                    "postcss-preset-env"
                                ]
                            ]
                        }
                    }
                }, 'less-loader']
            },
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader"
                  }
                ]
            },
            { 
                test: /\.(jpe?g|png|gif)$/i,
                include: [path.resolve(__dirname, './src/assets/img')],
                use: [
                   {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash8].[ext]'
                                }
                            }
                        }
                   }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                include: [path.resolve(__dirname, './src/assets/media')],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10240,
                      fallback: {
                        loader: 'file-loader',
                        options: {
                          name: 'fonts/[name].[hash:8].[ext]'
                        }
                      }
                    }
                  }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|browser_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env", 
                                {
                                    "modules": false,
                                    "useBuiltIns": "entry",
                                    "corejs": 3
                                },
                            ],
                            [
                                "@babel/preset-react",
                                {
                                    "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
                                    "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
                                    "throwIfNamespace": false, // defaults to true
                                    "runtime": "classic"
                                }
                            ],
                            [
                                "react-app",
                                {
                                    "runtime": "automatic"
                                }
                            ]
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime", 
                            "@babel/plugin-proposal-class-properties"
                        ]
                    },
                }
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'svg-sprite-loader',
                }
            },
        ]
    },
    resolve:{
        alias:{
          '@':path.resolve(__dirname,'./src'),
          'components': path.resolve(__dirname, './src/components')
        },
        extensions:['*','.js','.json', 'node_modules', './src/components']
    },
    devServer: {
        port: 3000,
        hot: true,
        compress: true,
        static: path.join(__dirname, 'dist'),
        proxy: {
            "/api": {
                target: "https://mobile-ms.uat.homecreditcfc.cn/mock/60fe79229850ad001dfeaa29/",
                secure: false,
                changeOrigin: true
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./static/vendor.manifest.json')
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new GoodPlugin(),
        new AddAssetHtmlPlugin({ 
            filepath: path.resolve(__dirname, './static/*.dll.js'),
            publicPath: './'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({}),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ],
}
