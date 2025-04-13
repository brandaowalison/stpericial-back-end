const PDFDocument = require('pdfkit')
const Report = require('../models/report')

const createReport = async (req, res) => {
    try {
        const report = new Report({
            title: req.body.title,
            description: req.body.description,
            dateEmission: req.body.dateEmission,
            expertResponsible: req.body.expertResponsible,
            evidence: req.body.evidence
        })
        await report.save()
        res.status(201).json({message: 'Laudo adicionado com sucesso!', report: report})
    } catch (err) {
        console.error('Erro ao adicionar laudo:', err)
        res.status(500).json({error: 'Erro ao adicionar laudo.', details: err.message})
    }
}

const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
        res.status(201).json(reports)
    } catch (err) {
        console.error({message: 'Erro ao listar os laudos:', err});
        res.status(500).json({error: 'Erro ao listar os laudos.', details: err.message})
    }
}

const getReportById = async (req, res) => {
    const {id} = req.params
    
    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }
    try {
        const report = await Report.findById(id)
        if(report) {
            res.status(200).json(report)
        } else {
            res.status(404).json({message: `Não foi encontrado nenhum laudo com essa id=${id}.`})
        }
    } catch (err) {
        console.error({message: 'Erro ao buscar laudo:', err})
        res.status(500).json({error: 'Erro ao buscar laudo.'})
    }
}

const updateReport = async (req, res) => {
    const {id} = req.params

    try {
        const updatedReport= await Report.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedReport) {
            return res.status(400).json({message: `Não foi encontrado nenhum laudo com essa id=${id}.`})
        }
        res.status(200).json({message: 'Laudo atualizada com sucesso!', updatedReport})
    } catch (err) {
        console.error('Erro ao atualizar laudo:', err)
        res.status(500).json({error: 'Erro ao atualizar laudo.'})
    }
}

const deleteReportById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedReport= await Report.deleteOne({_id: id})
        
        if(deletedReport.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum laudo encontrada com essa id${id}.`})
        }
        res.status(200).json({message: `Laudo com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar laudo:', err)
        res.status(500).json({message: 'Erro ao deletar laudo.'})
    }
}

const deleteReports = async (req, res) => {
    try {
        const deletedReports = await Report.deleteMany()
        res.status(200).json({message: 'Todos os laudos foram deletados com sucesso!', deletedCount: deletedReports.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todos os laudos:', err)
        res.status(500).json({error: 'Erro ao deletar todos os laudos.'})
    }
}

const generateReportPdf = async (req, res) => {
    const {id} = req.params
    
    try {
        const report = await Report.findById(id)
            .populate('expertResponsible', 'name')
            .populate('evidence')

        if(!report) {
            return res.status(404).json({message: 'Laudo não encontrado.'})
        }
        
        const doc = new PDFDocument()
        res.setHeader('Content-Type','application/pdf')
        res.setHeader('Content-Disposition',`inline; filename="laudo_${id}.pdf`)

        doc.pipe(res)

        doc.fontSize(20).text('Laudo Pericial', {align: 'center'})
        doc.moveDown()
        
        doc.fontSize(12).text(`Título: ${report.title}`)
        doc.text(`Descrição: ${report.description}`)
        doc.text(`Data de Emissão: ${new Date(report.dateEmission).toLocaleDateString()}`)
        doc.text(`Perito responsável: ${report.expertResponsible?.name || 'Não informado'}`)
        doc.moveDown()

        doc.text('---')
        doc.text(`Gerado em: ${new Date().toLocaleString()}`)

        doc.end()
    } catch (err) {
        console.error('Erro ao gerar PDF do laudo:', err)
        res.status(500).json({error: 'Erro ao gerar PDF.'})
    }
}

module.exports = {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReportById,
    deleteReports,
    generateReportPdf
}