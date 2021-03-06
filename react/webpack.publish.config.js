// webpack的发布配置文件
var path = require('path');
var webpack=require('webpack')
// 自动生成html插件
var HtmlWebpackPlugin=require('html-webpack-plugin')
// 提取css文件的插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// 删除文件夹
var CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    // 单页面spa的入口文件
    entry: {
        app: path.resolve(__dirname, 'src/js/app.js'),
        vendors: ['react', 'react-dom','react-router']
    },
    // 构建之后的文件输出位置配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            // 将jsx和ES6语法转换为ES5语法的加载器
            {
                test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
                loader: 'babel',// 加载模块 "babel" 是 "babel-loader" 的缩写
                query: {
                    presets: ['es2015', 'react','stage-0','stage-1','stage-2','stage-3']
                }
            },
            // 可以在js中引用css的加载器
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader","css-loader")// 如果同时使用多个加载器中间用！连接，加载器的执行顺序是从右往左
            },
            // 处理scss文件
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            },
            // 处理图片引用的1kb=1024b  1b=8bit 25000bit~3kb
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                loader: 'url?limit=25000000&name=images/[name].[ext]'
            },
            // 处理字体
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                loader: 'url?limit=25000000&name=fonts/[name].[ext]'
            }

        ]
    },
    resolve: {
        // 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        // 注意一下, extensions 第一个是空字符串! 对应不需要后缀的情况.
        extensions: ['', '.js', '.json', '.scss', '.jsx']
        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址。后续直接 require('AppStore') 即可
        //alias: {
        //    AppStore: 'js/stores/AppStores.js',
        //    ActionType: 'js/actions/ActionType.js',
        //    AppAction: 'js/actions/AppAction.js'
        //}
    },
    // 在这个属性里面定义的包是不会被打包进bundle。js文件中的,如果你要用这个属性，别忘了在index。html中引入cdn
    //externals: {
    //    配置了这个属性之后react和react-dom这些第三方的包都不会被构建进js中，那么我们就需要通过cdn进行文件的引用了
    //    // 前边这个名称是在项目中引用用的，相当于import React from  ‘react1’中的react，
    //    //'react1':"react",
    //    'react1':"react",
    //    'react-dom1':"react-dom",
    //     '$1':"jQuery"
    //
    //},
    plugins: [
        new CleanPlugin(['dist']),
        // 分离第三方应用插件,name属性会自动指向entry中vendros属性，filename属性中的文件会自动构建到output中的path属性下面
        new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js'}),
        new ExtractTextPlugin("app.css"),
        new HtmlWebpackPlugin({
            template: './src/template.html',
            htmlWebpackPlugin: {
                "files": {
                    "css": ["app.css"],
                    "js": ["vendors.js","bundle.js"]
                }
            },
            // 效果不大，情怀至上
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            //去掉react中的警告，react会自己判断
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

    ]


}
