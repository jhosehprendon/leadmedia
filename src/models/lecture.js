const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    videoLink: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
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
    },
    ownerModule: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Module'
    }
}, {
    timestamps: true
})

const Lecture = mongoose.model('Lecture', lectureSchema)

module.exports = Lecture