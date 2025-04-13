const express = require('express')
const dentalsRecordsController = require('../controllers/dentalRecord.controller')
const router = express.Router()

router.post('/', dentalsRecordsController.createDentalRecord)
router.get('/', dentalsRecordsController.getDentalRecords)
router.get('/:id', dentalsRecordsController.getDentalRecordById)
router.put('/:id', dentalsRecordsController.updateDentalRecord)
router.delete('/:id', dentalsRecordsController.deleteDentalsRecords)

module.exports = router
