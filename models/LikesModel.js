const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema({
    count: {
        type: Number,
        default: 0
    },
    users: [{
        type: Schema.Types.ObjectId, ref: "users"
    }]
}, { versionKey: false, autoIndex: false });
module.exports = mongoose.model("likes", likesSchema);