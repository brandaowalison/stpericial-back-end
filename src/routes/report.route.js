const express = require('express')
const reportController = require('../controllers/report.controller')
const router = express.Router()

router.post('/', reportController.createReport)
router.get('/', reportController.getReports)
router.get('/:id', reportController.getReportById)
router.get('/:id/pdf', reportController.generateReportPdf)
router.put('/:id', reportController.updateReport)
router.delete('/:id', reportController.deleteReportById)
router.delete('/', reportController.deleteReports)

module.exports = router