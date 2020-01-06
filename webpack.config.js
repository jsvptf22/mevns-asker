const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    entry: "./app/src/front/main.js",
    output: {
        path: __dirname + "/app/public/js",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader"
                }
            }
        ]
    },
    plugins: [new VueLoaderPlugin()]
};
