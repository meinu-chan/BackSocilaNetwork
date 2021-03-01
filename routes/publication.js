const express = require("express");
const controller = require("../controllers/publication")
const passport = require("passport");
const router = express.Router();

// localhost:5000/api/publication/
router.put("/", passport.authenticate("jwt", { session: false }), controller.publication)

// localhost:5000/api/publication/rate
router.put("/rate", passport.authenticate("jwt", { session: false }), controller.rate)

// localhost:5000/api/publication/getAll
router.get("/getAll/:userId", controller.getPubl)

module.exports = router