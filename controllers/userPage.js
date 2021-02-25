module.exports.user = (req, res) => {
    const { _id, nickname, publications } = req.user
    res.status(200).json({
        _id, nickname, publications
    })
}
