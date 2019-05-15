const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ownerCourse: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }
}, {
    timestamps: true
})

// moduleSchema.virtual('lecture', {
//     ref: 'Lecture',
//     localField: '_id',
//     foreignField: 'ownerModule'
// })

// moduleSchema.pre('findOneAndDelete', async function(next) {
//     const course = this
//     await Videos.deleteMany({ ownerBusiness: course._conditions._id })
//     next()
// })


const Module = mongoose.model('Module', moduleSchema)

module.exports = Module