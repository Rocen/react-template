const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        vendor: ['react', 'react-dom'],
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].dll.js',
        library: '_dll_[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.resolve(__dirname, 'static', '[name].manifest.json'),
            context: __dirname
        })
    ]
}