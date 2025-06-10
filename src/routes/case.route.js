const express = require('express')
const casesController = require('../controllers/case.controller')
const router = express.Router()
const { authenticate, authorize } = require('../middlewares/auth')

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: API para gerenciamento de casos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Case:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do caso (gerado automaticamente)
 *         type:
 *           type: string
 *           description: Tipo do caso
 *         title:
 *           type: string
 *           description: Título do caso
 *         description:
 *           type: string
 *           description: Descrição do caso
 *         status:
 *           type: string
 *           enum: [em_andamento, finalizado, arquivado]
 *           description: Status atual do caso
 *         numberProcess:
 *           type: string
 *           description: Número do processo (se houver)
 *         openingDate:
 *           type: string
 *           format: date
 *           description: Data de abertura do caso
 *         closingDate:
 *           type: string
 *           format: date
 *           description: Data de fechamento do caso
 *         responsible:
 *           type: string
 *           description: ID do usuário responsável
 *         victim:
 *           type: array
 *           description: Lista de IDs das vítimas associadas ao caso
 *           items:
 *             type: string
 *             description: ID da vítima (ObjectId)
 */

/**
 * @swagger
 * /api/cases:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Case'
 *     responses:
 *       201:
 *         description: Caso adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 case:
 *                   $ref: '#/components/schemas/Case'
 *       500:
 *         description: Erro ao adicionar caso
 */
router.post('/', authenticate, authorize(['admin', 'perito']), casesController.createCase)

/**
 * @swagger
 * /api/cases:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Case'
 *       500:
 *         description: Erro ao listar os casos
 */
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), casesController.getCases)

/**
 * @swagger
 * /api/cases/{id}:
 *   get:
 *     summary: Retorna um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       404:
 *         description: Caso não encontrado
 *       500:
 *         description: Erro ao buscar caso
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), casesController.getCaseById)

/**
 * @swagger
 * /api/cases/{id}:
 *   put:
 *     summary: Atualiza um caso existente
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Case'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedCase:
 *                   $ref: '#/components/schemas/Case'
 *       400:
 *         description: ID inválido ou caso não encontrado
 *       500:
 *         description: Erro ao atualizar caso
 */
router.put('/:id', authenticate, authorize(['admin', 'perito']), casesController.updateCase)

/**
 * @swagger
 * /api/cases/{id}:
 *   delete:
 *     summary: Deleta um caso pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do caso a ser deletado
 *     responses:
 *       200:
 *         description: Caso deletado com sucesso
 *       404:
 *         description: Caso não encontrado
 *       500:
 *         description: Erro ao deletar caso
 */
router.delete('/:id', authenticate, authorize(['admin']), casesController.deleteCaseById)

/**
 * @swagger
 * /api/cases:
 *   delete:
 *     summary: Deleta todos os casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Todos os casos foram deletados com sucesso
 *       500:
 *         description: Erro ao deletar todos os casos
 */
router.delete('/', authenticate, authorize(['admin']), casesController.deleteCases)

module.exports = router
