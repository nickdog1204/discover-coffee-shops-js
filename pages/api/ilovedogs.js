const handler = (req, res) => {
    res.status(200).json({message: `I love '${req.query.breed}'`})
}

export default handler;