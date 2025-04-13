const Patient = require('../models/patient')

const createPatient = async (req, res) => {
    try {
        const patient = new Patient({
            name: req.body.name,
            sex: req.body.sex,
            dateBirth: req.body.dateBirth,
            identification: req.body.identification,
            identified: req.body.identified,
            observations: req.body.observations
        })
        await patient.save()
        res.status(201).json({message: 'Paciente adicionado com sucesso!', patient: patient})
    } catch (err) {
        console.error('Erro ao adicionar paciente:', err)
        res.status(500).json({error: 'Erro ao adicionar paciente.', details: err.message})
    }
}

const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find()
        res.status(201).json(patients)
    } catch (err) {
        console.error({message: 'Erro ao listar os pacientes:', err});
        res.status(500).json({error: 'Erro ao listar os pacientes.', details: err.message})
    }
}

const getPatientById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const patient = await Patient.findById(id)
        if(patient) {
            res.status(200).json(patient)
        } else {
            res.status(404).json({message: `Não foi encontrado nenhum paciente com essa id=${id}.`})
        }
    } catch (err) {
        console.error({message: 'Erro ao buscar paciente:', err})
        res.status(500).json({error: 'Erro ao buscar paciente.'})
    }
}

const updatePatient = async (req, res) => {
    const {id} = req.params

    try {
        const updatedPatient = await Patient.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedPatient) {
            return res.status(400).json({message: `Não foi encontrado nenhum paciente com essa id=${id}.`})
        }
        res.status(200).json({message: 'Paciente atualizada com sucesso!', updatedPatient})
    } catch (err) {
        console.error('Erro ao atualizar paciente:', err)
        res.status(500).json({error: 'Erro ao atualizar paciente.'})
    }
}

const deletePatientById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedPatient = await Patient.deleteOne({_id: id})
        
        if(deletedPatient.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum paciente encontrado com essa id${id}.`})
        }
        res.status(200).json({message: `Paciente com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar paciente:', err)
        res.status(500).json({message: 'Erro ao deletar paciente.'})
    }
}

const deletePatients = async (req, res) => {
    try {
        const deletedPatients = await Patient.deleteMany()
        res.status(200).json({message: 'Todos os pacientes foram deletadas com sucesso!', deletedCount: deletedPatients.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todos os pacientes:', err)
        res.status(500).json({error: 'Erro ao deletar todas os pacientes.'})
    }
}

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatientById,
    deletePatients
}