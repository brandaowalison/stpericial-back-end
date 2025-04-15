const express = require('express')
const gRController = require('../controllers/generalRecord.controller')
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
 * /api/general-reports:
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
 * /api/general-reports:
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
 * /api/general-reports/{id}:
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
 * /api/general-reports/{id}:
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
 * /api/general-reports/{id}:
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
 * /api/general-reports:
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

module.exports = router
