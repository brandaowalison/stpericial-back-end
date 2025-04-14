const express = require('express')
const reportController = require('../controllers/report.controller')
const router = express.Router()
const {authenticate, authorize} = require('../middlewares/auth')

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do laudo (gerado automaticamente)
 *         title:
 *           type: string
 *           description: Título do laudo
 *         description:
 *           type: string
 *           description: Descrição do laudo
 *         dateEmission:
 *           type: string
 *           format: date-time
 *           description: Data de emissão do laudo
 *         expertResponsible:
 *           type: string
 *           description: ID do usuário responsável pelo laudo
 *         evidence:
 *           type: string
 *           description: ID da evidência associada ao laudo
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Cria um novo laudo
 *     operationId: createReport
 *     tags: [Laudos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Laudo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   $ref: '#/components/schemas/Report'
 *       500:
 *         description: Erro ao criar o laudo
 */
router.post('/', authenticate, authorize(['admin','perito']), reportController.createReport)

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Lista todos os laudos
 *     operationId: getReports
 *     tags: [Laudos]
 *     responses:
 *       200:
 *         description: Lista de laudos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       500:
 *         description: Erro ao listar os laudos
 */
router.get('/', authenticate, authorize(['admin','perito','assistente']), reportController.getReports)

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Retorna um laudo pelo ID
 *     operationId: getReportById
 *     tags: [Laudos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laudo
 *     responses:
 *       200:
 *         description: Laudo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Laudo não encontrado
 *       500:
 *         description: Erro ao buscar o laudo
 */
router.get('/:id', authenticate, authorize(['admin','perito','assistente']), reportController.getReportById)

/**
 * @swagger
 * /api/reports/{id}/pdf:
 *   get:
 *     summary: Gera um PDF de um laudo
 *     operationId: generateReportPdf
 *     tags: [Laudos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laudo para gerar o PDF
 *     responses:
 *       200:
 *         description: PDF do laudo gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: byte
 *       404:
 *         description: Laudo não encontrado
 *       500:
 *         description: Erro ao gerar o PDF do laudo
 */
router.get('/:id/pdf', authenticate, authorize(['admin','perito']), reportController.generateReportPdf)

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Atualiza um laudo existente
 *     operationId: updateReport
 *     tags: [Laudos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laudo a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       200:
 *         description: Laudo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedReport:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: ID inválido ou laudo não encontrado
 *       500:
 *         description: Erro ao atualizar o laudo
 */
router.put('/:id', authenticate, authorize(['admin','perito']), reportController.updateReport)

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Deleta um laudo pelo ID
 *     operationId: deleteReportById
 *     tags: [Laudos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laudo a ser deletado
 *     responses:
 *       200:
 *         description: Laudo deletado com sucesso
 *       404:
 *         description: Laudo não encontrado
 *       500:
 *         description: Erro ao deletar o laudo
 */
router.delete('/:id', authenticate, authorize(['admin','perito']), reportController.deleteReportById)

/**
 * @swagger
 * /api/reports:
 *   delete:
 *     summary: Deleta todos os laudos
 *     operationId: deleteReports
 *     tags: [Laudos]
 *     responses:
 *       200:
 *         description: Todos os laudos foram deletados com sucesso
 *       500:
 *         description: Erro ao deletar os laudos
 */
router.delete('/', authenticate, authorize(['admin']), reportController.deleteReports)

module.exports = router