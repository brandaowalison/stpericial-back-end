const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String, 
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    dateEmission: {
        type: Date,
        default: Date.now
    },
    expertResponsible: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    evidence: {
        type: mongoose.Schema.ObjectId,
        ref: 'Evidence',
        required: true
    }
}, {timestamps: true})

const Report = mongoose.model('Report', reportSchema)
module.exports = Report