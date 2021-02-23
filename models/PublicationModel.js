const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publicationSchema = new Schema({
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
        maxLength: 1000,
    },
    likes: {
        type: Number,
        default: 0
    },
}, { versionKey: false, autoIndex: false });

module.exports = mongoose.model("publications", publicationSchema);