const _ = require("lodash");
const Publication = require("../models/PublicationModel")
const User = require("../models/UserModel")
const Comment = require("../models/CommentsModel")
const errorHandler = require("../utils/errorHandler")


module.exports.publication = async (req, res) => {
    const { user: { _id: userId, publications }, body: { value } } = req

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
        const { likedUsers } = publication
        const flag = likedUsers.includes(_id)
        if (flag) {
            _.remove(likedUsers, (userId) => _id == userId)
            await publication.updateOne({ likedUsers })
        } else {
            likedUsers.push(_id)
            await publication.save()
        }
        try {
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
    const { params: { userId } } = req

    const user = await User.findById({ _id: userId })

    const { publications } = user
    if (user) {
        const publics = []
        try {
            for (const publId in publications) {
                const publication = await Publication.findById({ _id: publications[publId] })
                publics.push(publication)
            }
        } catch (error) {
            errorHandler(error, res)
        }
        res.status(200).json({ publications: publics })

    } else {
        res.status(404).json({
            message: "No publications."
        })
    }
}

module.exports.show = async (req, res) => {
    try {

        const { params: { id } } = req

        const p = await Publication.findById(id)
        const publication = p.view()

        const { nickname } = await User.findById(publication.userId)

        publication.comments = await Comment.find({ _id: { $in: publication.comments } })

        res.status(200).json({ ...publication, nickname })

    } catch (error) {
        console.log(error)
    }

}