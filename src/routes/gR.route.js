const express = require('express')
const gRController = require('../controllers/generalReport.controller')
const { authenticate, authorize } = require('../middlewares/auth')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Relatórios Gerais
 *   description: API para gerenciamento de relatórios gerais
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GeneralReport:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do relatório geral (gerado automaticamente)
 *         title:
 *           type: string
 *           description: Título do relatório
 *         description:
 *           type: string
 *           description: Descrição do relatório
 *         creationDate:
 *           type: string
 *           format: date
 *           description: Data de criação do relatório
 *         user:
 *           type: string
 *           description: ID do usuário responsável pelo relatório
 *         case:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs dos casos associados ao relatório
 *         evidence:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs das evidências associadas ao relatório
 *         report:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs dos laudos associados ao relatório
 *         observations:
 *           type: string
 *           description: Observações adicionais sobre o relatório
 *         status:
 *           type: string
 *           enum: [rascunho, finalizado, enviado]
 *           description: Status atual do relatório
 */

/**
 * @swagger
 * /api/genRecord:
 *   post:
 *     summary: Cria um novo relatório geral
 *     tags: [Relatórios Gerais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralReport'
 *     responses:
 *       201:
 *         description: Relatório criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   $ref: '#/components/schemas/GeneralReport'
 *       500:
 *         description: Erro ao criar relatório
 */
router.post('/', authenticate, authorize(['admin', 'perito']), gRController.createGeneralReport)

/**
 * @swagger
 * /api/genRecord:
 *   get:
 *     summary: Lista todos os relatórios gerais
 *     tags: [Relatórios Gerais]
 *     responses:
 *       200:
 *         description: Lista de relatórios retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GeneralReport'
 *       500:
 *         description: Erro ao buscar relatórios
 */
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), gRController.getGeneralReports)

/**
 * @swagger
 * /api/genRecord/{id}:
 *   get:
 *     summary: Retorna um relatório geral pelo ID
 *     tags: [Relatórios Gerais]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do relatório
 *     responses:
 *       200:
 *         description: Relatório encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralReport'
 *       404:
 *         description: Relatório não encontrado
 *       500:
 *         description: Erro ao buscar relatório
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), gRController.getGeneralReportsById)

/**
 * @swagger
 * /api/genRecord/{id}:
 *   put:
 *     summary: Atualiza um relatório geral existente
 *     tags: [Relatórios Gerais]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do relatório a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralReport'
 *     responses:
 *       200:
 *         description: Relatório atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedGr:
 *                   $ref: '#/components/schemas/GeneralReport'
 *       400:
 *         description: ID inválido ou relatório não encontrado
 *       500:
 *         description: Erro ao atualizar relatório
 */
router.put('/:id', authenticate, authorize(['admin', 'perito']), gRController.updateGr)

/**
 * @swagger
 * /api/genRecord{id}:
 *   delete:
 *     summary: Deleta um relatório geral pelo ID
 *     tags: [Relatórios Gerais]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do relatório a ser deletado
 *     responses:
 *       200:
 *         description: Relatório deletado com sucesso
 *       404:
 *         description: Relatório não encontrado
 *       500:
 *         description: Erro ao deletar relatório
 */
router.delete('/:id', authenticate, authorize(['admin']), gRController.deleteGrById)

/**
 * @swagger
 * /api/genRecord:
 *   delete:
 *     summary: Deleta todos os relatórios gerais
 *     tags: [Relatórios Gerais]
 *     responses:
 *       200:
 *         description: Todos os relatórios foram deletados com sucesso
 *       500:
 *         description: Erro ao deletar todos os relatórios
 */
router.delete('/', authenticate, authorize(['admin']), gRController.deleteGr)

/**
 * @swagger
 * /api/genRecord/{case_id}:
 *   get:
 *     summary: Gera um relatório geral com IA para um caso específico
 *     tags: [Relatórios Gerais]
 *     parameters:
 *       - name: case_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso para o qual o relatório será gerado
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 report:
 *                   $ref: '#/components/schemas/GeneralReport'
 *       404:
 *         description: Caso não encontrado ou relatório já existe
 *       500:
 *         description: Erro ao gerar relatório
 */
router.get('/generalReport/:case_id', authenticate, authorize(['admin', 'perito']), gRController.generateGeneralReportWithIA)

/**
/api/genRecord/sendEmail/{id}:
 *   post:
 *     summary: Envia o relatório geral em PDF por e-mail para o usuário autenticado
 *     tags: [Relatórios Gerais]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do relatório geral a ser enviado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do destinatário
 *     responses:
 *       200:
 *         description: Relatório geral enviado por e-mail com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: E-mail do usuário logado não encontrado
 *       404:
 *         description: Relatório geral não encontrado
 *       500:
 *         description: Erro ao enviar relatório geral por e-mail
 */
router.post('/sendEmail/:id', authenticate, authorize(['admin', 'perito']), gRController.sendGenaralReportByEmail)
module.exports = router
