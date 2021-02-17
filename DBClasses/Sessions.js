const mongoose = require("mongoose")

class SessionDB {
    constructor() {
        this.url = "mongodb://localhost:27017/usersdb";

        this.usersSchema = new mongoose.Schema({
            login: { type: String, required: true, minLength: 3, maxLength: 20 },
            email: { type: String, required: true, minLength: 3, maxLength: 20 }
        });

        this.user = mongoose.model("UserModel", this.usersSchema);
    }

    addUser({ login, email }) {
        mongoose.connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true });
        this.user.create({ login, email }, (err, user) => {
            mongoose.disconnect();

            if (err) return console.log(err);

            return console.log("Successfully added new user: ", user);
        })
    }

    findUserBy({ email }) {
        mongoose.connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true });
        this.user.find({ email }, (err, user) => {
            mongoose.disconnect()

            if (err) return console.log(err);

            console.log(user);
        })
    }

    deleteUser({ email }) {
        mongoose.connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true });
        this.user.deleteOne({ email }, (err, user) => {
            mongoose.disconnect()

            if (err) return console.log(err);

            console.log("Successfully deleted new user: ", user);
        })
    }

    clearCollection() {
        mongoose.connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true });
        this.user.deleteMany({}, (err, user) => {
            mongoose.disconnect()

            if (err) return console.log(err);

            console.log("Collection clear", user);
        })
    }

    showUsers() {
        mongoose.connect(this.url, { useUnifiedTopology: true, useNewUrlParser: true });
        this.user.find({}, (err, user) => {
            mongoose.disconnect()

            if (err) return console.log(err);

            console.log(user);
        })

    }
}

module.exports = SessionDB;