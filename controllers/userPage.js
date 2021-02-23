// const mongoose = require('mongoose');
const Publication = require("../models/PublicationModel")
const errorHandler = require("../utils/errorHandler")

module.exports.user = (req, res) => {
    // console.log(req)
    const { _id, nickname, publications } = req.user
    res.status(200).json({
        _id, nickname, publications
    })
}

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
        res.status(404).json({
            message: "Something go wrong..."
        })
    }
}

module.exports.rate = async (req, res) => {

    const { user: { publications }, body: { publicId, status } } = req

    const _id = publications.find(publ => publ == publicId)

    if (_id) {

        const publication = await Publication.findById({ _id })
        try {
            status ? publication.likes++ : publication.likes--
            await publication.save()
            res.status(200).json({
                publications
            })

        } catch (error) {
            errorHandler(error, res)
        }
    } else {
        res.status(404).json({
            message: "Something go wrong..."
        })
    }
}