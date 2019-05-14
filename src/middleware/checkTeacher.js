
const checkTeacher = async (req, res, next) => {
    try {
        if(!res.locals.user.teacher) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'You are not a teacher and not allowed to take actions on courses'
        })
    }
}

module.exports = checkTeacher