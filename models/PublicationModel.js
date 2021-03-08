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
    likedUsers: [
        {
            type: String
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId, ref: "comments"
        }
    ]
}, { versionKey: false, autoIndex: false });

module.exports = mongoose.model("publications", publicationSchema);