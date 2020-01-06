const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
    name: String,
    state: Number
});

module.exports = mongoose.model("Room", roomSchema);
