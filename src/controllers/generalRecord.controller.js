const GeneralReport = require('../models/generalReport')

const createGeneralReport = async (req, res) => {
    try {
        const report = new GeneralReport({
            title: req.body.title,
            description: req.body.description,
            user: req.body.user,
            case: req.body.case,
            evidence: req.body.evidence,
            report: req.body.report,
            observations: req.body.observations,
            status: req.body.status
        })
        await report.save()
        res.status(201).json({ message: 'Relatório criado com sucesso', report })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar relatório', error: err.message })
    }
}

const getGeneralReports = async(req, res) => {
    try {
        const reports = await GeneralReport.find()
          .populate('user', 'name email role')
          .populate('case')
          .populate('evidence')
          .populate('report')
        res.status(200).json(reports)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar relatórios', error: err.message })
    }
}

const getGeneralReportsById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const report = await GeneralReport.findById(id)
          .populate('user', 'name email role')
          .populate('case')
          .populate('evidence')
          .populate('report')
        if (!report) return res.status(404).json({ message: 'Relatório não encontrado' })
        res.status(200).json(report)
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar relatório', error: err.message })
    }
}

const updateGr = async (req, res) => {
    const {id} = req.params

    try {
        const updatedGr = await GeneralReport.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedGr) {
            return res.status(400).json({message: `Não foi encontrado nenhum relatótio com essa id=${id}.`})
        }
        res.status(200).json({message: 'Relatório atualizado com sucesso!', updatedGr})
    } catch (err) {
        console.error('Erro ao atualizar relatório:', err)
        res.status(500).json({error: 'Erro ao atualizar relatório.'})
    }
}

const deleteGrById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedGr= await GeneralReport.deleteOne({_id: id})
        
        if(deletedGr.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum relatótio encontrado com essa id${id}.`})
        }
        res.status(200).json({message: `Relatório com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar relatótio:', err)
        res.status(500).json({message: 'Erro ao deletar relatótio.'})
    }
}

const deleteGr = async (req, res) => {
    try {
        const deletedGr = await GeneralReport.deleteMany()
        res.status(200).json({message: 'Todos os relatótio foram deletados com sucesso!', deletedCount: deletedGr.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todos os relatótio:', err)
        res.status(500).json({error: 'Erro ao deletar todos os relatótio.'})
    }
}

module.exports = {
    createGeneralReport,
    getGeneralReports,
    getGeneralReportsById,
    updateGr,
    deleteGrById,
    deleteGr
}