const mongoose = require('mongoose')

const evidenceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['imagem','video','documento'],
        required: true,
    },
    collectionDate: {
        type: Date,
        default: Date.now
    },
    collectedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true

    },
    case: {
        type: mongoose.Schema.ObjectId,
        ref: 'Case',
        required: true
    }
}, {timestamps: true})


const Evidence = mongoose.model('Evidence', evidenceSchema)
module.exports = Evidence