const express = require('express')
const evidenceController = require('../controllers/evidence.controller')

const router = express.Router()

router.post('/', evidenceController.createEvidence)
router.get('/', evidenceController.getEvidences)
router.get('/:id', evidenceController.getEvidenceById)
router.put('/:id', evidenceController.updateEvidence)
router.delete('/:id', evidenceController.deleteEvidenceById)
router.delete('/', evidenceController.deleteEvidences)

module.exports = router