module.exports.user = (req, res) => {
    const { _id, nickname } = req.user
    res.status(200).json({
        _id, nickname
    })
}