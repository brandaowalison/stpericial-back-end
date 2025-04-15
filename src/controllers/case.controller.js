const Case = require('../models/case')
const victim = require('../models/victim')

const createCase = async (req, res) => {
    try {
        const createAcase = new Case({
            type: req.body.type,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            numberProcess: req.body.numberProcess,
            openingDate: req.body.openingDate,
            closingDate: req.body.closingDate,
            responsible: req.body.responsible,
            victim: req.body.victim
        })
        await createAcase.save()
        res.status(201).json({message: 'Caso adicionado com sucesso!', createAcase: createAcase})
    } catch (err) {
        console.error('Erro ao adicionar caso:', err)
        res.status(500).json({error: 'Erro ao adicionar caso.', details: err.message})
    }
}

const getCases = async (req, res) => {
    try {
        console.log('Requisitando casos com populate de victim...')
        const cases = await Case.find().populate('victim').exec()

        console.log('Casos encontrados:', cases)
        res.status(201).json(cases)
    } catch (err) {
        console.error({message: 'Erro ao listar os casos:', err});
        res.status(500).json({error: 'Erro ao listar os casos.', details: err.message})
    }
}

const getCaseById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const oneCase = await Case.findById(id).populate('victim').exec()
        if(oneCase) {
            res.status(200).json(oneCase)
        } else {
            res.status(404).json({message: `Não foi encontrado nenhum caso com essa id=${id}.`})
        }
    } catch (err) {
        console.error({message: 'Erro ao buscar caso:', err})
        res.status(500).json({error: 'Erro ao buscar caso.'})
    }
}

const updateCase = async (req, res) => {
    const {id} = req.params

    try {
        const updatedCase = await Case.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedCase) {
            return res.status(400).json({message: `Não foi encontrado nenhum caso com essa id=${id}.`})
        }
        res.status(200).json({message: 'Caso atualizado com sucesso!', updatedCase})
    } catch (err) {
        console.error('Erro ao atualizar caso:', err)
        res.status(500).json({error: 'Erro ao atualizar caso.'})
    }
}

const deleteCases = async (req, res) => {
    try {
        const deletedCases = await Case.deleteMany()
        res.status(200).json({message: 'Todos os casos foram deletados com sucesso!', deletedCount: deletedCases.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todos os casos:', err)
        res.status(500).json({error: 'Erro ao deletar todos os casos.'})
    }
}

const deleteCaseById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedCase = await Case.deleteOne({_id: id})
        
        if(deletedCase.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum caso encontrado com essa id${id}.`})
        }
        res.status(200).json({message: `Caso com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar caso:', err)
        res.status(500).json({message: 'Erro ao deletar caso.'})
    }
}

module.exports = {
    createCase,
    getCases,
    getCaseById,
    updateCase,
    deleteCases,
    deleteCaseById
}