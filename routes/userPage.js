const express = require("express");
const controller = require("../controllers/userPage")
const passport = require("passport");
const router = express.Router();

// localhost:5000/api/page
router.get("/", passport.authenticate("jwt", { session: false }), controller.user)

// localhost:5000/api/page/find/id=123
router.get("/find/:id", controller.findById)

// localhost:5000/api/page/find/nickname=123
router.get("/find/name/:nickname", passport.authenticate("jwt", { session: false }), controller.findByName)

// localhost:5000/api/page/friends/add
router.put("/friends/add", passport.authenticate("jwt", { session: false }), controller.addFriend)

// localhost:5000/api/page/friends
router.get("/friends/:id", controller.getFriends)

module.exports = router