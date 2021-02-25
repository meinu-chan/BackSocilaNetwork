const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    value: {
        type: String,
        maxLength: 500,
    },
}, { versionKey: false, autoIndex: false });

module.exports = mongoose.model("comments", commentSchema);