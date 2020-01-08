const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    entry: {
        roomSelecter: "./app/src/front/entries/roomSelecter.js",
        room: "./app/src/front/entries/room.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/app/public/js"
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
