const Course = require('../models/course');

const checkCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({ _id: req.params.idCourse, owner: res.locals.user._id })

        if(!course) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'Course id provided does not exist or you are not the owner'
        })
    }
}

module.exports = checkCourse