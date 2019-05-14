const mongoose = require('mongoose');
// const Videos = require('./videos');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

courseSchema.virtual('videos', {
    ref: 'Videos',
    localField: '_id',
    foreignField: 'ownerCourse'
})

courseSchema.pre('findOneAndDelete', async function(next) {
    const course = this
    await Videos.deleteMany({ ownerBusiness: course._conditions._id })
    next()
})


const Course = mongoose.model('Course', courseSchema)

module.exports = Course