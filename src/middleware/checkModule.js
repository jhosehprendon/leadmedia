const Module = require('../models/module');

const checkModule = async (req, res, next) => {
    try {
        const modules = await Module.findOne({ _id: req.params.idModule, owner: res.locals.user._id })

        if(!modules) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'Module id provided does not exist or you are not the owner'
        })
    }
}

module.exports = checkModule