const mongoose = require('mongoose')

const generalReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  creationDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  case: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }],
  evidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  report: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  observations: String,
  status: {
    type: String,
    enum: ['rascunho', 'finalizado', 'enviado'],
    default: 'rascunho',
  }
})

const GeneralReport = mongoose.model('GeneralReport', generalReportSchema)
module.exports = GeneralReport