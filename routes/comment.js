const express = require("express");
const controller = require("../controllers/comment")
const passport = require("passport");
const router = express.Router();

// localhost:5000/api/comment/addComment
router.put("/addComment", passport.authenticate("jwt", { session: false }), controller.addComment)

// localhost:5000/api/comment/addComment
router.post("/getComment", passport.authenticate("jwt", { session: false }), controller.getComment)

module.exports = router