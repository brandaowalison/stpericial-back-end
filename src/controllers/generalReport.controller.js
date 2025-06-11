const axios = require('axios')
const nodemailer = require('nodemailer')
const GeneralReport = require('../models/generalReport')
const User = require('../models/user')
const Case = require('../models/case')
const Evidence = require('../models/evidence')
const Report = require('../models/report')
const Victim = require('../models/victim')
const { assinarLaudo } = require('../utils/assinatura')

const createGeneralReport = async (req, res) => {
    try {
        const report = new GeneralReport({
            title: req.body.title,
            description: req.body.description,
            user: req.body.user,
            case: req.body.case,
            evidence: req.body.evidence,
            report: req.body.report,
            victim: req.body.victim,
            observations: req.body.observations,
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
          .populate('victim')
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
          .populate('victim')
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

const generateGeneralReportWithIA = async (req, res) => {
    const {case_id} = req.params

    if (!case_id) 
        return res.status(400).json({message: 'ID do caso não fornecido.'})

    try {
        const caseData = await Case.findById(case_id)
        if (!caseData) {
            return res.status(404).json({error: 'Caso não encontrado.'})
        }

        const evidences = await Evidence.find({case: case_id})
        const reports = await Report.find({evidence: {$in: evidences.map(e => e._id)}})
        const victims = await Victim.find({case: case_id})

        if (!evidences.length && !reports.length && !victims.length) {
            return res.status(404).json({error: 'Não há informações suficientes para gerar o relatório.'})
        }

        const prompt = ` Gere um Relatório Geral com base nestas informações:
            - Usuário: ${req.user?.name || 'Não informado'}
            - Caso: ${caseData.title}
            - Descrição: ${caseData.description || 'Não informado'}
            - Evidências: ${evidences.map(e => 
                `- Tipo: ${e.type || 'Não informado'}, Descrição: ${e.text || 'Não informado'}`).join('\n')
            }
            - Laudos: ${reports.map(r => 
                `- Evidência: ${r.evidence}, Descrição: ${r.description || 'Não informado'}`).join('\n')}
            - Vítimas: ${victims.map(v => 
                `- Nome: ${v.name || 'Não informado'}, 
                Idade: ${v.age || 'Não informado'}, 
                Gênero: ${v.sex || 'Não informado'}, 
                Etnia: ${v.ethnicity || 'Não informado'},
                Identificação: ${v.identification || 'Não informado'},
                Observações: ${v.observations || 'Não informado'},
                Identificado: ${v.identified ? 'Sim' : 'Não'}`).join('\n')}
            
        Com base nas informações acima, gere um relatório técnico, claro e conclusivo com até 1500 caracteres, sem usar formatação ou marcações especiais. Use linguagem formal e descritiva..`
            
        const response = await axios.post('https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente especializado em gerar relatórios investigativos baseados em dados técnicos de casos forenses.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                        ],
                            temperature: 0.7,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                            }   
                        }
                    )
        const generatedReport = response.data.choices[0].message.content
        
        if (!generatedReport || generatedReport.length === 0) {
            return res.status(500).json({error: 'Não foi possível gerar o relatório.'})
        }

        const newGenralReport = new GeneralReport({
            title: `Relatório Geral - Caso: ${caseData.title}`,
            description: generatedReport,
            user: req.user?._id,
            case: case_id,
            evidence: evidences.map(e => e._id),
            report: reports.map(r => r._id),
            victim: victims.map(v => v._id),
            observations: 'Relatório gerado automaticamente pela IA.',
        })

        await newGenralReport.save()
        res.status(201).json({
            message: 'Relatório geral gerado com sucesso!',
            reportId: newGenralReport._id
        })
    } catch (err) {
        console.error('Erro ao gerar relatório geral com IA:', err)
        res.status(500).json({error: 'Erro ao gerar relatório geral com IA.'})
    }
}

const sendGenaralReportByEmail = async (req, res) => {
        const { id } = req.params
        // Pega o e-mail do usuário autenticado
        const email  = req.user?.email

        if (!email) {
        return res.status(400).json({ message: 'E-mail do usuário logado não encontrado.' })
        }
        
        try {
        const report = await GeneralReport.findById(id)
            .populate('user', 'name')
            .populate('case')
            .populate('evidence')
            .populate('report')
            .populate('victim')

        if (!report) {
        return res.status(404).json({ message: 'Relatório geral não encontrado.' })
        }

        const contentToSubscribe = `
            Descrição: ${report.description}
            Observações: ${report.observations || 'Nenhuma'}
        `
        const assinatura = assinarLaudo(contentToSubscribe)

        const PDFDocument = require('pdfkit')
        const { PassThrough } = require('stream')
        const path = require('path')

        const doc = new PDFDocument()
        const stream = new PassThrough()
        doc.pipe(stream)

        const logoPath = path.join(__dirname, '../assets/images/logo-stpericial.jpeg')

        doc.image(logoPath, 50, 20, { width: 100 })
        doc.fontSize(20).text('Relatório Geral', { align: 'center' })
        doc.moveDown()
        doc.moveDown()
        doc.text(`Descrição:`)
        doc.fontSize(10).text(report.description || 'Não informado', { align: 'justify' })
        doc.moveDown()
        if (report.victim.length) {
        doc.fontSize(12).text('Vítimas:')
        report.victim.forEach((v, i) => {
        doc.fontSize(10).text(`- ${v.name}, ${v.age || 'idade não informada'}, ${v.sex}, ${v.ethnicity}`)
        })
        doc.moveDown()
        }

        if (report.evidence.length) {
        doc.fontSize(12).text('Evidências:')
        report.evidence.forEach((e, i) => {
        doc.fontSize(10).text(`- Tipo: ${e.type}, Descrição: ${e.text}`)
        })
        doc.moveDown()
        }
        if (report.report.length) {
        doc.fontSize(12).text('Laudos:')
        report.report.forEach((r, i) => {
        doc.fontSize(10).text(`- ${r.description}`)})
        doc.moveDown()
        }
        doc.text(`Observações: ${report.observations || 'Nenhuma'}`)
        doc.moveDown()
        doc.text(`Gerado em: ${new Date().toLocaleString()}`)
        doc.moveDown()
        doc.fontSize(10).text('Assinatura digital:', { underline: true })
        doc.font('Helvetica').fontSize(8).text(assinatura, { width: 500 })

        doc.end()

        const pdfBuffer = await new Promise((resolve, reject) => {
        const bufs = []
        stream.on('data', d => bufs.push(d))
        stream.on('end', () => resolve(Buffer.concat(bufs)))
        stream.on('error', reject)
        })

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        })

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Relatório Geral - ${report.title}`,
        text: 'Segue em anexo o Relatório Geral solicitado.',
        attachments: [
            {
            filename: `relatorio_geral_${report._id}.pdf`,
            content: pdfBuffer
            }
        ]
        })

        res.status(200).json({ message: 'Relatório geral enviado por e-mail com sucesso!' })
    } catch (err) {
        console.error('Erro ao enviar relatório geral:', err)
        res.status(500).json({ error: 'Erro ao enviar relatório geral por e-mail.' })
    }
}
   


module.exports = {
    createGeneralReport,
    getGeneralReports,
    getGeneralReportsById,
    updateGr,
    deleteGrById,
    deleteGr,
    generateGeneralReportWithIA,
    sendGenaralReportByEmail
}