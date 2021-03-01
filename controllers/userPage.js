const { ObjectID } = require("bson")
const User = require("../models/UserModel")
const errorHandler = require("../utils/errorHandler")

module.exports.user = (req, res) => {
    const { _id, nickname, publications, friends } = req.user
    res.status(200).json({
        _id, nickname, publications, friends
    })
}

module.exports.findById = async (req, res) => {
    const { params: { id } } = req
    try {
        const userId = id.replace("id=", "")

        const user = await User.findById(ObjectID(userId)).catch(err => console.log(err))

        if (user) {
            res.status(200).json({
                user
            })
        } else {
            res.status(404).json({
                message: "User doesn't exist."
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Invalid identity.",
            error: error.message
        })
    }
}

module.exports.findByName = async (req, res) => {
    const { params: { nickname } } = req
    try {
        const userNickname = nickname.replace("nickname=", "")
        const user = await User.findOne({ nickname: userNickname })
        user ? res.status(200).json({ user }) :
            res.status(404).json({ message: "User didn't found." })

    } catch (error) {
        errorHandler(error, res)
    }

}

module.exports.addFriend = async (req, res) => {
    const { user: { _id }, body: { userId } } = req
    const user = await User.findById(_id)
    if (user) {
        const { friends } = user
        try {
            friends.push(userId)
            await user.save()
            res.status(200).json({ user })
        } catch (error) {
            errorHandler(error, res)
        }
    } else {
        res.status(404).json({
            message: "User with this id didn't found."
        })
    }
}

module.exports.getFriends = async (req, res) => {
    const { params: { id } } = req
    try {
        const userId = id.replace("id=", "")

        const user = await User.findById(userId)

        if (user) {
            const { friends } = user

            const fs = []

            for (const friendId in friends) {
                const friend = await User.findById(friends[friendId])
                const { publications, _id, nickname } = friend
                fs.push({ publications, friends: friend.friends, _id, nickname })
            }

            res.status(200).json({
                friends: [...fs]
            })

        } else {
            res.status(404).json({
                message: "User didn't found."
            })
        }

    } catch (error) {
        errorHandler(error, res)
    }
}