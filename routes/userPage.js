const express = require("express");
const controller = require("../controllers/userPage")
const passport = require("passport");
const router = express.Router();

// localhost:5000/api/userPage
router.get("/", passport.authenticate("jwt", { session: false }), controller.user)

module.exports = router