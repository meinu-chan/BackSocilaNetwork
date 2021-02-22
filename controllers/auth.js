const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const keys = require("../config/keys");

module.exports.login = async (req, res) => {
    const candidate = await User.findOne({ nickname: req.body.nickname })
    if (candidate) {
        //checking password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            //token generation
            const token = jwt.sign({
                nickname: candidate.nickname,
                userId: candidate._id
            }, keys.jwt, { expiresIn: 60 * 60 })

            res.status(200).json({ token: `Bearer ${token}` })
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
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();

            const token = jwt.sign({
                nickname: user.nickname,
                userId: user._id
            }, keys.jwt, { expiresIn: 60 * 60 })

            res.status(201).json({ token: `Bearer ${token}` })
        } catch (e) {
            console.log(e)
        }
    }
}