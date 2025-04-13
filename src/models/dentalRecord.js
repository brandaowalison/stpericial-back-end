const mongoose = require('mongoose')

const dentalRecordSchema = new mongoose.Schema({
    missingTeeth: [{
        type: String,
        trim: true
    }],
    dentalMarks: [String],
    xRayImage: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
})

const DentalRecord = mongoose.model('DentalRecord', dentalRecordSchema)

module.exports = DentalRecord