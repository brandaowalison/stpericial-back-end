const mongoose = require('mongoose');
// data q ocorreu e local
const caseSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String, 
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
        
    },
    status: {
        type: String, 
        enum: ['em_andamento','finalizado','arquivado'], 
        default: 'em_andamento'
    },
    numberProcess: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 8,
        maxlength: 20
    },
    openingDate: {
        type: Date, 
        default: Date.now
    },
    closingDate: Date,
    responsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    victim: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Victim'
    }]
}, {timestamps: true});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case