const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    }, publications: [{
        type: Schema.Types.ObjectId, ref: "publications"
    }]
}, { versionKey: false, autoIndex: false });

module.exports = mongoose.model("users", userSchema);