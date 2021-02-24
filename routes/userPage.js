const express = require("express");
const controller = require("../controllers/userPage")
const passport = require("passport");
const router = express.Router();

// localhost:5000/api/page
router.get("/", passport.authenticate("jwt", { session: false }), controller.user)

// localhost:5000/api/page/publication
router.put("/publication", passport.authenticate("jwt", { session: false }), controller.publication)

// localhost:5000/api/page/publication/rate
router.put("/publication/rate", passport.authenticate("jwt", { session: false }), controller.rate)

// localhost:5000/api/page/publication/getAll
router.get("/publication/getAll", passport.authenticate("jwt", { session: false }), controller.getPubl)

module.exports = router