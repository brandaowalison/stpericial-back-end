const mongoose = require('mongoose')

const victimsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true
    },
    sex: {
        type: String,
        enum: ['masculino','feminino','outro'],
        required: true
    },
    dateBirth: {
        type: Date,
        required: true
    },
    identification: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9]+$/
    },
    identified: {
        type: Boolean,
        default: true
    },
    observations: {
        type: String,
        trim: true
    }
}, {timestamps: true})

const Victim = mongoose.model('Victim', victimsSchema)
module.exports = Victim