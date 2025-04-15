const mongoose = require('mongoose')

const dentalRecordSchema = new mongoose.Schema({
    missingTeeth: [{
        type: String,
        trim: true
    }],
    dentalMarks: [String],
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    victim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Victim',
        required: true
    }
})

const DentalRecord = mongoose.model('DentalRecord', dentalRecordSchema)

module.exports = DentalRecord