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

    const { user: { publications, _id }, body: { publicId } } = req

    const publicationId = publications.find(publ => publ == publicId)

    if (publicationId) {
        const publication = await Publication.findById(publicId)

        const { likes, likedUsers } = publication;

        let flag = likedUsers.find(userId => userId == _id)
        if (flag) {
            const count = likes - 1;
            _.remove(likedUsers, (userId) => userId == flag)
            await publication.updateOne({ likes: count, likedUsers: [...likedUsers] })
            flag = false
        } else {
            const count = likes + 1;
            await publication.updateOne({ likes: count, likedUsers: likedUsers.push(_id) })
            flag = true
        }
        try {
            await publication.save()
            res.status(200).json({
                publication, flag
            })
        } catch (error) {
            errorHandler(error, res)
        }

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

module.exports.addComments = (req, res) => {
    console.log(req)
}