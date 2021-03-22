const User = require("../models/UserModel")
const errorHandler = require("../utils/errorHandler")
const _ = require("lodash")

const getFriendsObj = async ({ publications, requests, waitingForResponse, _id, nickname, friends }) => {
    const friendsArr = await Promise.all(friends.map(async (friendId) => {
        const friend = await User.findById(friendId)
        return { friendId, friendNickname: friend.nickname }
    }))

    const waitingForResponseArr = await Promise.all(waitingForResponse.map(async (waiterId) => {
        const waiter = await User.findById(waiterId)
        return { waiterId, waiterNickname: waiter.nickname }
    }))

    return { publications, requests, waitingForResponse: waitingForResponseArr, _id, nickname, friends: friendsArr }
}

module.exports.findById = (req, res) => {
    const { params: { id } } = req
    try {
        const userPromise = new Promise(async (resolve, reject) => {
            const user = await User.findById({ _id: id })
            const { publications, requests, waitingForResponse, _id, nickname, friends } = user

            resolve({ publications, requests, waitingForResponse, _id, nickname, friends })
        })

        userPromise.then(user => getFriendsObj(user))
            .then(user => {
                // console.log(user)
                res.status(200).json({
                    user
                })
            })
            .catch((error) => {
                res.status(404).json({
                    message: error.message ? error.message : error
                })

            })

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
        const userPromise = new Promise(async (resolve, reject) => {
            const user = await User.findOne({ nickname: userNickname })
            const { publications, requests, waitingForResponse, _id, nickname, friends } = user

            resolve({ publications, requests, waitingForResponse, _id, nickname, friends })
        })

        userPromise.then(user => getFriendsObj(user))
            .then(user => {
                // console.log(user)
                res.status(200).json({
                    user
                })
            })
            .catch((error) => {
                res.status(404).json({
                    message: error.message ? error.message : error
                })

            })


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
        getFriendsObj(user).then((data) => {
            res.status(200).json(
                { ...data }
            )
        }).catch(err => errorHandler(err, res))

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
    console.log(user)
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

            getFriendsObj(potentialFriend).then((data) => {
                res.status(200).json(
                    { ...data }
                )
            }).catch(err => errorHandler(err, res))


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

module.exports.deleteFriend = async (req, res) => {
    const { body: { userId }, user } = req

    const ex_friend = await User.findById(userId)
    if (ex_friend) {
        if (ex_friend.friends.includes(user._id)) {
            const { friends: f_friends, _id: f_id } = ex_friend;
            const { friends: u_friends, _id: u_id } = user;
            try {
                _.remove(f_friends, (id) => id == u_id.toString())
                await ex_friend.updateOne({ friends: f_friends })
                _.remove(u_friends, (id) => id == f_id.toString())
                await user.updateOne({ friends: u_friends })

                getFriendsObj(ex_friend).then((data) => {
                    res.status(200).json(
                        { ...data }
                    )
                }).catch(err => errorHandler(err, res))

            } catch (error) {
                errorHandler(error, res)
            }
        }
        else {
            res.status(404).json({
                message: "Friend does not exist."
            })
        }
    } else {
        res.status(404).json({
            message: "User does not exist."
        })
    }
}