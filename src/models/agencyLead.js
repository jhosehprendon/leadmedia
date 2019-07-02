const mongoose = require('mongoose');
const validator = require('validator');

const agencyLeadSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: Number
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
    }
}, {
    timestamps: true
})

const AgencyLead = mongoose.model('AgencyLead', agencyLeadSchema)

module.exports = AgencyLead