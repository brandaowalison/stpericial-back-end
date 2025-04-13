const express = require('express')
const patientsController = require('../controllers/patient.controller')
const router = express.Router()

router.post('/', patientsController.createPatient)
router.get('/', patientsController.getPatients)
router.get('/:id', patientsController.getPatientById)
router.put('/:id', patientsController.updatePatient)
router.delete('/:id', patientsController.deletePatientById)
router.delete('/', patientsController.deletePatients)

module.exports = router