const mongoose = require('mongoose')

const evidenceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['imagem','video','documento', "text"],
        required: true,
    },
    text: {
        type: String,
        trim: true 
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
        validate: function(value) {
            const validUrl = /^(http?:\/\/)/
            const validImage = /\.(jpg|jpeg|png|gif)$/i
            const isLocalPath = /^uploads\//
            return validUrl.test(value) || validImage.test(value) || isLocalPath.test(value)
        },
        message: 'O campo fileUrl deve ser uma URL válida, uma imagem ou um caminho de arquivo local.',

    },
    case: {
        type: mongoose.Schema.ObjectId,
        ref: 'Case',
        required: true
    }
}, {timestamps: true})


const Evidence = mongoose.model('Evidence', evidenceSchema)
module.exports = Evidence