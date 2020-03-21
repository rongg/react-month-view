var path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/month_view.jsx',
    output: {
        path: path.resolve('lib'),
        filename: 'month_view.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};