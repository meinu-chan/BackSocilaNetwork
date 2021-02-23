const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const keys = require("../config/keys");
const errorHandler = require("../utils/errorHandler")

module.exports.login = async (req, res) => {
    const candidate = await User.findOne({ nickname: req.body.nickname })
    if (candidate) {
        //checking password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            const { _id, nickname, publications } = candidate
            //token generation
            const token = jwt.sign({
                nickname,
                userId: _id,
                publications,
            }, keys.jwt, { expiresIn: 60 * 60 })

            res.status(200).json({
                token: `Bearer ${token}`,
                nickname,
                userId: _id,
                publications,
            })
        } else {
            // Passwords mismatch
            res.status(401).json({
                message: "Password mismatch. Try again."
            })
        }
    } else {
        //user doesn't exist
        res.status(404).json({
            message: "Can't found user with this nickname."
        })
    }
}

module.exports.register = async (req, res) => {

    const candidate = await User.findOne({ nickname: req.body.nickname });

    if (candidate) {
        // Email already exist
        res.status(409).json({
            message: "This nickname is already taken."
        });
    } else {
        // adding user in DB
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            nickname: req.body.nickname,
            password: bcrypt.hashSync(password, salt),
            publications: []
        });

        try {
            await user.save();
            const { _id, nickname, publications } = user
            const token = jwt.sign({
                nickname,
                userId: _id,
                publications,
            }, keys.jwt, { expiresIn: 60 * 60 })

            res.status(201).json({ token: `Bearer ${token}`, userId: _id, nickname, publications })
        } catch (error) {
            errorHandler(error, res)
        }
    }
}