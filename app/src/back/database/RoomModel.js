const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
    name: {
        type: String
    },
    state: {
        type: String,
        default: 1
    },
    questions: [
        new Schema({
            label: String,
            approve: { type: Number, default: 0 },
            reject: { type: Number, default: 0 },
            state: { type: Number, default: 1 }
        })
    ]
});

module.exports = mongoose.model("Room", roomSchema);
