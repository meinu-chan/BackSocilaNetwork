const _ = require("lodash");
// const mongoose = require('mongoose');
const Comment = require("../models/CommentsModel")
const Publication = require("../models/PublicationModel");
const User = require("../models/UserModel");
const errorHandler = require("../utils/errorHandler")

module.exports.addComment = async (req, res) => {
    const { user: { _id: userId }, body: { publicId, value } } = req

    const publication = await Publication.findById({ _id: publicId })

    if (publication) {
        const comment = new Comment({
            userId, date: Date.now(), value
        })
        try {
            await comment.save()
                .catch(e => errorHandler(e, res))

            publication.updateOne({ comments: publication.comments.push(comment) })

            await publication.save()
                .catch(e => errorHandler(e, res))

            res.status(201).json({
                comment
            })
        } catch (error) {
            errorHandler(error, res);
        }
    } else {
        res.status(404).json({
            message: "Publication didn't find."
        })
    }
}
module.exports.getComment = async (req, res) => {
    const { body: { commentId } } = req

    const comment = await Comment.findById({ _id: commentId })

    const user = await User.findById(comment.userId)

    if (comment && user) {
        const { nickname } = user
        const { _id, date, value } = comment
        res.status(200).json({
            _id, date, value, nickname
        })
    } else {
        res.status(404).json({
            message: "Comment didn't found."
        })
    }
}