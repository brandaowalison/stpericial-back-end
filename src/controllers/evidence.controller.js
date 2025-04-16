const Evidence = require('../models/evidence')

const createEvidence = async (req, res) => {
    try {
        const fileUrl = req.file ? req.file.path : req.body.fileUrl;
        const evidence = new Evidence({
            type: req.body.type,
            text: req.body.text,
            collectionDate: req.body.collectionDate,
            collectedBy: req.body.collectedBy,
            fileUrl: fileUrl,
            case: req.body.case
        })
        await evidence.save()
        res.status(201).json({message: 'Evidência adicionado com sucesso!', evidence: evidence})
    } catch (err) {
        console.error('Erro ao adicionar evidência:', err)
        res.status(500).json({error: 'Erro ao adicionar evidência.', details: err.message})
    }
}

const getEvidences = async (req, res) => {
    try {
        const evidences = await Evidence.find()
        res.status(201).json(evidences)
    } catch (err) {
        console.error({message: 'Erro ao listar as evidências:', err});
        res.status(500).json({error: 'Erro ao listar as evidências.', details: err.message})
    }
}

const getEvidenceById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const evidence = await Evidence.findById(id)
        if(evidence) {
            res.status(200).json(evidence)
        } else {
            res.status(404).json({message: `Não foi encontrado nenhuma evidência com essa id=${id}.`})
        }
    } catch (err) {
        console.error({message: 'Erro ao buscar evidência:', err})
        res.status(500).json({error: 'Erro ao buscar evidência.'})
    }
}

const updateEvidence = async (req, res) => {
    const {id} = req.params

    try {
        const updatedEvidence = await Evidence.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedEvidence) {
            return res.status(400).json({message: `Não foi encontrado nenhuma evidência com essa id=${id}.`})
        }
        res.status(200).json({message: 'Evidência atualizada com sucesso!', updatedEvidence})
    } catch (err) {
        console.error('Erro ao atualizar evidência:', err)
        res.status(500).json({error: 'Erro ao atualizar evidência.'})
    }
}

const deleteEvidenceById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedEvidence = await Evidence.deleteOne({_id: id})
        
        if(deletedEvidence.deletedCount === 0) {
            return res.status(404).json({message: `Nenhuma evidência encontrada com essa id${id}.`})
        }

        
        res.status(200).json({message: `Evidência com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar evidência:', err)
        res.status(500).json({message: 'Erro ao deletar evidência.'})
    }
}

const deleteEvidences = async (req, res) => {
    try {
        const deleteEvidences = await Evidence.deleteMany()
        res.status(200).json({message: 'Todos as evidências foram deletadas com sucesso!', deletedCount: deleteEvidences.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todas as evidências:', err)
        res.status(500).json({error: 'Erro ao deletar todas as evidências.'})
    }
}

module.exports = {
    createEvidence,
    getEvidences,
    getEvidenceById,
    updateEvidence,
    deleteEvidenceById,
    deleteEvidences
}