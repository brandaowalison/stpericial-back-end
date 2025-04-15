const Victim = require('../models/victim')

const createVictim = async (req, res) => {
    try {
        const victim = new Victim({
            name: req.body.name,
            sex: req.body.sex,
            dateBirth: req.body.dateBirth,
            identification: req.body.identification,
            identified: req.body.identified,
            observations: req.body.observations
        })
        await victim.save()
        res.status(201).json({message: 'Vítima adicionada com sucesso!', victim: victim})
    } catch (err) {
        console.error('Erro ao adicionar vítima:', err)
        res.status(500).json({error: 'Erro ao adicionar vítima.', details: err.message})
    }
}

const getVictims = async (req, res) => {
    try {
        const victims = await Victim.find()
        res.status(201).json(victims)
    } catch (err) {
        console.error({message: 'Erro ao listar os vítimas:', err});
        res.status(500).json({error: 'Erro ao listar os vítimas.', details: err.message})
    }
}

const getVictimById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const victim = await Victim.findById(id)
        if(victim) {
            res.status(200).json(victim)
        } else {
            res.status(404).json({message: `Não foi encontrado nenhuma vítima com essa id=${id}.`})
        }
    } catch (err) {
        console.error({message: 'Erro ao buscar vítimas:', err})
        res.status(500).json({error: 'Erro ao buscar vítimas.'})
    }
}

const updateVictim = async (req, res) => {
    const {id} = req.params

    try {
        const updatedVictim = await Victim.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedVictim) {
            return res.status(400).json({message: `Não foi encontrado nenhuma vítima com essa id=${id}.`})
        }
        res.status(200).json({message: 'Paciente atualizada com sucesso!', updatedVictim})
    } catch (err) {
        console.error('Erro ao atualizar paciente:', err)
        res.status(500).json({error: 'Erro ao atualizar paciente.'})
    }
}

const deleteVictimById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedVictim = await Victim.deleteOne({_id: id})
        
        if(deletedVictim.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum paciente encontrado com essa id${id}.`})
        }
        res.status(200).json({message: `Vítima com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar vítima:', err)
        res.status(500).json({message: 'Erro ao deletar vítima.'})
    }
}

const deleteVictims = async (req, res) => {
    try {
        const deletedVictims = await Victim.deleteMany()
        res.status(200).json({message: 'Todas as vítimas foram deletadas com sucesso!', deletedCount: deletedPatients.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todas as vítima:', err)
        res.status(500).json({error: 'Erro ao deletar todas as vítimas.'})
    }
}

module.exports = {
    createVictim,
    getVictims,
    getVictimById,
    updateVictim,
    deleteVictimById,
    deleteVictims
}