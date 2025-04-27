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
        required: true,
        validate: {
            validator: function(value) {
                const validExtensions = /\.(jpg|jpeg|png|gif|pdf|mp4|avi|mov|mkv|webm)$/i
                const isHttpUrl = /^https?:\/\/.+/i.test(value)
                const hasValidExtension = validExtensions.test(value)
                const isRawUpload = value.includes('/raw/upload/')
                
                return isHttpUrl && (hasValidExtension || isRawUpload)
            },
            message: props => `${props.value} não é uma URL válida com extensão permitida (.jpg, .png, .gif, .pdf, .mp4, .mov, etc.)`
        }
    },
    case: {
        type: mongoose.Schema.ObjectId,
        ref: 'Case',
        required: true
    }
}, {timestamps: true})


const Evidence = mongoose.model('Evidence', evidenceSchema)
module.exports = Evidence