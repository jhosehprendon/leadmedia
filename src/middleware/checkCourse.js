const Course = require('../models/course');

const checkCourse = async (req, res, next) => {
    try {
        const course = await Course.findById({ _id: req.params.idCourse })

        if(!course) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'Course id provided does not exist'
        })
    }
}

module.exports = checkCourse