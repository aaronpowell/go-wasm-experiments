const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.go', '.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.go/,
                use: [
                    {
                        loader: path.join(
                            __dirname,
                            'loaders',
                            'golang-simple.js'
                        )
                    }
                ]
            }
        ]
    },
    node: {
        fs: 'empty'
    }
};
