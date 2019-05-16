const Module = require('../models/module');

const checkModule = async (req, res, next) => {
    try {
        const modules = await Module.findById({ _id: req.params.idModule })

        if(!modules) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'Module id provided does not exist'
        })
    }
}

module.exports = checkModule