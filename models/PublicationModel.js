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
        maxLength: 2000,
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

publicationSchema.methods = {
    view() {
        const view = {}
        const fields = ["userId", "date", "value", "likedUsers", "comments"]

        fields.forEach((field) => view[field] = this.get(field))

        return view
    }
}

module.exports = mongoose.model("publications", publicationSchema);