const PDFDocument = require('pdfkit')
const {assinarLaudo} = require('../utils/assinatura')
const Report = require('../models/report')
const Evidence = require('../models/evidence')
const axios = require('axios')
const nodemailer = require('nodemailer')

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

        const contentToSubscribe = `
            Título: ${report.title}
            Descrição: ${report.description}
            Data de Emissão: ${new Date(report.dateEmission).toLocaleDateString()}
            Perito responsável: ${report.expertResponsible?.name || 'Não informado'}
        `
        
        const assinatura = assinarLaudo(contentToSubscribe)
        
        const doc = new PDFDocument()
        res.setHeader('Content-Type','application/pdf')
        res.setHeader('Content-Disposition',`inline; filename="laudo_${id}.pdf`)
        
        const evidence = report.evidence

        if(!evidence) {
            return res.status(404).json({message: 'Evidência não encontrada.'})
        }
        doc.pipe(res)

        const path = require('path')
        const logoPath = path.join(__dirname, '../assets/images/logo-stpericial.jpeg')
        
        doc.image(logoPath, 50, 20, {width: 100})
        doc.fontSize(20).text('Laudo Pericial', {align: 'center'})
        doc.moveDown()
        
        doc.fontSize(12).text(`ID da Evidência: ${evidence._id}`)
        doc.text(`Nome da Evidência: ${evidence.type || 'Não informado'}`)
        doc .text(`Descrição da Evidência: ${evidence.text || 'Não informado'}`)
        doc.moveDown()

        doc.fontSize(12).text(`Título: ${report.title}`)
        doc.text(`Descrição: ${report.description}`)
        doc.moveDown()
        doc.text(`Data de Emissão: ${new Date(report.dateEmission).toLocaleDateString()}`)
        doc.text(`Perito responsável: ${report.expertResponsible?.name || 'Não informado'}`)
        doc.moveDown()

        doc.text('---')
        doc.text(`Gerado em: ${new Date().toLocaleString()}`)
        doc.moveDown()

        doc.fontSize(10).text('Assinatura digital:', {underline: true})
        doc.font('Helvetica').fontSize(8).text(assinatura, {
            width:500
        })

        doc.end()
    } catch (err) {
        console.error('Erro ao gerar PDF do laudo:', err)
        res.status(500).json({error: 'Erro ao gerar PDF.'})
    }
}

const generateReportWithIA = async (req, res) => {
    const {case_id} = req.params

    if (!case_id) {
        return res.status(400).json({ error: "O 'caseID' é obrigatório."})
    }

    try {
        const evidences = await Evidence.find({case: case_id})

        if (!evidences || evidences.length === 0) {
            return res.status(400).json({ error: `Nenhuma evidência encontrada para o caso '${case_id}'.`})
        }
        const createReport = []

        for (const evidence of evidences) {
            const prompt = `Gere um laudo pericial com base nesta evidência:
                - Tipo: ${evidence.type}
                - Descrição: ${evidence.text}
                - Data da Coleta: ${new Date(evidence.collectionDate).toLocaleDateString('pt-BR')}
                - Coletada por: ${evidence.collectedBy}
                - URL do Arquivo: ${evidence.fileUrl}

        Crie um laudo técnico e objetivo com base exclusivamente na evidência fornecida. O texto deve ter no máximo 1000 caracteres, sem usar formatação ou marcações especiais. Use linguagem formal e descritiva.`

        const response = await axios.post('https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    {
                    role: 'system',
                    content: 'Você é um assistente especializado em gerar laudos periciais detalhados com base em evidências fornecidas.'
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

        if (!generatedReport || generatedReport.trim() === '') {
            continue
        }
        const newReport = new Report({
            title: `Laudo gerado automaticamente via IA para a envidência: ${evidence._id}`,
            description: generatedReport,
            dateEmission: new Date(),
            expertResponsible: req.user?._id || null,
            evidence: evidence._id
        })
        await newReport.save()
        createReport.push({reportId: newReport._id, evidenceId: evidence._id})
        }
        if (createReport.length === 0) {
            return res.status(400).json({ error: 'Nenhum laudo foi gerado com base na evidência.'})
        }
        res.status(200).json({
            message: 'Laudos gerados com sucesso!',
            reports: createReport
        })
    } catch (err) {
        console.error('Erro ao gerar laudo com IA:', err)
        res.status(500).json({ error: 'Erro ao gerar laudo com IA.' })
    }
}

const sendReportByEmail = async (req, res) => {
  const { id } = req.params
  // Pegue o e-mail do usuário autenticado
  const email = req.user?.email

  if (!email) {
    return res.status(400).json({ message: 'E-mail do usuário logado não encontrado.' })
  }

  try {
    const report = await Report.findById(id)
      .populate('expertResponsible', 'name')
      .populate('evidence')

    if (!report) {
      return res.status(404).json({ message: 'Laudo não encontrado.' })
    }

    const contentToSubscribe = `
      Título: ${report.title}
      Descrição: ${report.description}
      Data de Emissão: ${new Date(report.dateEmission).toLocaleDateString()}
      Perito responsável: ${report.expertResponsible?.name || 'Não informado'}
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
    doc.fontSize(20).text('Laudo Pericial', { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`ID da Evidência: ${report.evidence._id}`)
    doc.text(`Nome da Evidência: ${report.evidence.type || 'Não informado'}`)
    doc.text(`Descrição da Evidência: ${report.evidence.text || 'Não informado'}`)
    doc.moveDown()
    doc.text(`Título: ${report.title}`)
    doc.text(`Descrição: ${report.description}`)
    doc.moveDown()
    doc.text(`Data de Emissão: ${new Date(report.dateEmission).toLocaleDateString()}`)
    doc.text(`Perito responsável: ${report.expertResponsible?.name || 'Não informado'}`)
    doc.moveDown()
    doc.text('---')
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
      subject: `Laudo Pericial - ${report.title}`,
      text: 'Segue em anexo o Laudo Pericial solicitado.',
      attachments: [
        {
          filename: `laudo_${report._id}.pdf`,
          content: pdfBuffer
        }
      ]
    })

    res.status(200).json({ message: 'Laudo enviado por e-mail com sucesso!' })
  } catch (err) {
    console.error('Erro ao enviar laudo por e-mail:', err)
    res.status(500).json({ error: 'Erro ao enviar laudo por e-mail.' })
  }
}




module.exports = {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReportById,
    deleteReports,
    generateReportPdf,
    generateReportWithIA,
    sendReportByEmail
}