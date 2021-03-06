const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Course = require('./course');
const Module = require('./module');
const Lecture = require('./lecture');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true, 
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    teacher: {
        type: Boolean,
        default: false
    },
    paidCourses: {
        type: Array
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('course', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'owner'
})

////// Eliminate response data we don't want to show like password and bunch of tokens

userSchema.methods.toJSON = function() {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })

    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Deletes user courses when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Course.deleteMany({ owner: user._id })
    await Module.deleteMany({ owner: user._id })
    await Lecture.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User