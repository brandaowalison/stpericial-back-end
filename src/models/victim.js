const mongoose = require('mongoose')

const victimsSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    sex: {
        type: String,
        enum: ['masculino','feminino','outro'],
        required: true
    },
    dateBirth: {
        type: Date
    },
    identification: {
        type: String,
        unique: true,
        match: /^[a-zA-Z0-9]+$/
    },
    identified: {
        type: Boolean,
        required: true,
        default: true
        
    },
    observations: {
        type: String,
        trim: true
    }
}, {timestamps: true})

const Victim = mongoose.model('Victim', victimsSchema)
module.exports = Victim