const DentalRecord = require('../models/dentalRecord')

const createDentalRecord = async (req, res) => {
    try {
        const dentalRecord = new DentalRecord({
            missingTeeth: req.body.missingTeeth,
            dentalMarks: req.body.dentalMarks,
            notes: req.body.notes,
            victim: req.body.victim
        })
        await dentalRecord.save()
        res.status(201).json({message: 'Registro odontológico adicionado com sucesso!', dentalRecord: dentalRecord})
    } catch (err) {
        console.error('Erro ao adicionar registro odontológico:', err)
        res.status(500).json({error: 'Erro ao adicionar registro odontológico.', details: err.message})
    }
}

const getDentalRecords = async (req, res) => {
    try {
        const dentalRecord = await DentalRecord.find()
        res.status(200).json(dentalRecord)
    } catch (err) {
        console.error({message: 'Erro ao listar os registros odontológicos:', err});
        res.status(500).json({error: 'Erro ao listar os registros odontológicos.', details: err.message})
    }
}

const getDentalRecordById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const dentalRecord = await DentalRecord.findById(id)
        if(dentalRecord) {
            res.status(200).json(dentalRecord)
        } else {
            res.status(404).json({message: `Não foi encontrado nenhum registro odontológico com essa id=${id}.`})
        }
    } catch (err) {
        console.error({message: 'Erro ao buscar registro odontológico:', err})
        res.status(500).json({error: 'Erro ao buscar registro odontológico.'})
    }
}

const updateDentalRecord = async (req, res) => {
    const {id} = req.params

    try {
        const updatedDentalRecord = await DentalRecord.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedDentalRecord) {
            return res.status(400).json({message: `Não foi encontrado nenhum registro odontológico com essa id=${id}.`})
        }
        res.status(200).json({message: 'Registro Odontológico atualizado com sucesso!', updatedDentalRecord})
    } catch (err) {
        console.error('Erro ao atualizar registro odontológico:', err)
        res.status(500).json({error: 'Erro ao atualizar registro odontológico.'})
    }
}

const deleteDentalRecordById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedDentalRecord = await DentalRecord.deleteOne({_id: id})
        
        if(deletedDentalRecord.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum registro odontológico encontrado com essa id${id}.`})
        }
        res.status(200).json({message: `Registro Odontológico com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar registro odontológico:', err)
        res.status(500).json({message: 'Erro ao deletar registro odontológico.'})
    }
}

const deleteDentalsRecords = async (req, res) => {
    try {
        const deletedDentalsRecords = await DentalRecord.deleteMany()
        res.status(200).json({message: 'Todos os registro odontológico foram deletados com sucesso!', deletedCount: deletedDentalsRecords.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todos os registro odontológico:', err)
        res.status(500).json({error: 'Erro ao deletar todos os registro odontológico.'})
    }
}

module.exports = {
    createDentalRecord,
    getDentalRecords,
    getDentalRecordById,
    updateDentalRecord,
    deleteDentalRecordById,
    deleteDentalsRecords
}