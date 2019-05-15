const mongoose = require('mongoose');
const Module = require('./module');

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

courseSchema.virtual('module', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'ownerCourse'
})

courseSchema.pre('findOneAndDelete', async function(next) {
    const course = this
    console.log('heeeey')
    await Module.deleteMany({ ownerCourse: course._conditions._id })
    next()
})


const Course = mongoose.model('Course', courseSchema)

module.exports = Course