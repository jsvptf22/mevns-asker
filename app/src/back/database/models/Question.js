const mongoose = require("mongoose");
const { Schema } = mongoose;

const Question = new Schema({
    label: String,
    approve: Number,
    reject: Number,
    state: Number
});

module.exports = mongoose.model("Question", Question);
