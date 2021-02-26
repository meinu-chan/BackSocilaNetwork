const _ = require("lodash");
// const mongoose = require('mongoose');
const Publication = require("../models/PublicationModel")
// const Likes = require("../models/LikesModel");
const errorHandler = require("../utils/errorHandler")


module.exports.publication = async (req, res) => {
    const { user: { _id: userId, publications }, body: { value } } = req

    console.log(value)

    if (userId && publications && value) {
        const publication = new Publication({
            userId,
            date: Date.now(),
            value
        })

        try {
            await publication.save()
            publications.push(publication)
            await req.user.save()
        } catch (error) {
            errorHandler(error, res)
        }
        res.status(200).json({ publications })
    } else {
        res.status(500).json({
            message: "Something go wrong..."
        })
    }
}

module.exports.rate = async (req, res) => {

    const { user: { _id }, body: { publicId } } = req

    const publication = await Publication.findById(publicId)

    if (publication) {
        const { likes, likedUsers } = publication;

        const _likedUsers = [...likedUsers]

        let flag = likedUsers.includes(_id)
        console.log(flag, "flag")
        console.log()
        if (flag) {
            const count = likes - 1;
            console.log(likedUsers)
            _.remove(_likedUsers, (userId) => userId == _id)
            console.log(_likedUsers)
            await publication.updateOne({ likes: count, likedUsers: [..._likedUsers] })
        } else {
            const count = likes + 1;
            _likedUsers.push(_id)
            await publication.updateOne({ likes: count, likedUsers: _likedUsers })
        }
        try {
            await publication.save()
            res.status(200).json({
                publication, flag: !flag
            })
        } catch (error) {
            errorHandler(error, res)
        }

    }
    else {
        res.status(404).json({
            message: "Publication didn't found."
        })
    }
}

module.exports.getPubl = async (req, res) => {
    const { user: { publications } } = req
    if (publications === []) {
        res.status(404).json({
            message: "No publications."
        })
    } else {
        const publics = []
        for (const publId in publications) {
            const publication = await Publication.findById({ _id: publications[publId] })
            publics.push(publication)
        }
        res.status(200).json({ publications: publics })
    }
}
