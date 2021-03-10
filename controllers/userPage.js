const { ObjectID } = require("bson")
const User = require("../models/UserModel")
const errorHandler = require("../utils/errorHandler")
const _ = require("lodash")

module.exports.user = (req, res) => {
    const { user } = req
    res.status(200).json({
        user
    })
}

module.exports.findById = async (req, res) => {
    const { params: { id } } = req
    try {
        const userId = id.replace("id=", "")

        const user = await User.findById({ _id: userId }).catch(err => console.log(err))

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
    const { user, body: { userId, status } } = req

    const newFriend = await User.findById({ _id: userId })
    if (user && newFriend) {
        if (status) {
            const { friends } = user
            try {
                friends.push(userId)
                await user.save()
                newFriend.friends.push(user._id)
                await newFriend.save()
            } catch (error) {
                errorHandler(error, res)
            }
        }
        const { requests } = newFriend
        const { waitingForResponse } = user
        _.remove(waitingForResponse, (index) => index == userId)
        await user.updateOne({ waitingForResponse })
        _.remove(requests, (id) => id == user._id)
        await newFriend.updateOne({ requests })
        res.status(200).json({ user })

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

        const user = await User.findById({ _id: userId })

        if (user) {
            const { friends } = user

            const fs = []

            for (const friendId in friends) {
                const friend = await User.findById({ _id: friends[friendId] })
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

module.exports.sendRequest = async (req, res) => {
    const { body: { userId }, user } = req

    const potentialFriend = await User.findById({ _id: userId })

    if (potentialFriend && user) {
        try {
            const { waitingForResponse } = potentialFriend
            const { requests } = user
            const status = !waitingForResponse.includes(user._id)
            if (status) {
                waitingForResponse.push(user._id)
                await potentialFriend.save()
                requests.push(userId)
                await user.save()
            } else {
                _.remove(requests, (id) => id == userId)
                await user.updateOne({ requests })
                _.remove(waitingForResponse, (id) => id == user._id)
                await potentialFriend.updateOne({ waitingForResponse })
            }

            res.status(200).json({
                potentialFriend,
            })

        } catch (error) {
            errorHandler(error, res)
        }
    }
    else {
        res.status(404).json({
            message: "User doesn't exist."
        })
    }
}