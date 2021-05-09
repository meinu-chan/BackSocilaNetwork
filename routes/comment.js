const express = require("express");
const controller = require("../controllers/comment")
const passport = require("passport");
const router = express.Router();

// localhost:5000/api/comment/getComment
router.get("/getComment", controller.getComment)

// localhost:5000/api/comment/addComment
router.put("/addComment", passport.authenticate("jwt", { session: false }), controller.addComment)

module.exports = router