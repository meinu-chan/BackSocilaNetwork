const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth")
const userPageRoutes = require("./routes/userPage")
const publicationRoutes = require("./routes/publication")
const commentRoutes = require("./routes/comment")
const keys = require("./config/keys");
const app = express();

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected."))
    .catch((error) => console.log(error))

app.use(passport.initialize())
require("./middleware/passport")(passport)

app.use(require("morgan")("dev"))
app.use(require("cors")())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/api/auth", authRoutes)
app.use("/api/page", userPageRoutes)
app.use("/api/publication", publicationRoutes)
app.use("/api/comment", commentRoutes)


module.exports = app