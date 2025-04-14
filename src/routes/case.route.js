const express = require('express')
const casesController = require('../controllers/case.controller')
const router = express.Router()
const { authenticate, authorize } = require('../middlewares/auth')

/**
 * @swagger
 * components:
 *   schemas:
 *     Caso:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do caso (gerado automaticamente)
 *         tipo:
 *           type: string
 *           description: Tipo do caso
 *         titulo:
 *           type: string
 *           description: Título do caso
 *         descricao:
 *           type: string
 *           description: Descrição do caso
 *         status:
 *           type: string
 *           enum: [em_andamento, finalizado, arquivado]
 *           description: Status atual do caso
 *         numeroProcesso:
 *           type: string
 *           description: Número do processo (se houver)
 *         dataAbertura:
 *           type: string
 *           format: date
 *         dataFechamento:
 *           type: string
 *           format: date
 *         responsavel:
 *           type: string
 *           description: ID do usuário responsável
 */

/**
 * @swagger
 * /api/casos:
 *   post:
 *     summary: Cria um novo caso
 *     operationId: a_createCase
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 caso:
 *                   $ref: '#/components/schemas/Caso'
 */
router.post('/', authenticate, authorize(['admin', 'perito']), casesController.createCase)

/**
 * @swagger
 * /api/casos:
 *   get:
 *     summary: Lista todos os casos
 *     operationId: b_listCases
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *       500:
 *         description: Erro ao listar os casos
 */
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), casesController.getCases)

/**
 * @swagger
 * /api/casos/{id}:
 *   get:
 *     summary: Retorna um caso pelo ID
 *     operationId: c_getCaseById
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
 *       404:
 *         description: Caso não encontrado
 *       500:
 *         description: Erro ao buscar o caso
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), casesController.getCaseById)

/**
 * @swagger
 * /api/casos/{id}:
 *   put:
 *     summary: Atualiza um caso existente
 *     operationId: d_updateCase
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
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: Civil
 *               titulo:
 *                 type: string
 *                 example: Caso de fratura mandibular
 *               descricao:
 *                 type: string
 *                 example: Paciente apresenta fratura após acidente veicular.
 *               status:
 *                 type: string
 *                 enum: [em_andamento, finalizado, arquivado]
 *                 example: finalizado
 *               numeroProcesso:
 *                 type: string
 *                 example: 2023.000123-45
 *               dataAbertura:
 *                 type: string
 *                 format: date
 *                 example: 2023-10-01
 *               dataFechamento:
 *                 type: string
 *                 format: date
 *                 example: 2023-12-01
 *               responsavel:
 *                 type: string
 *                 example: 652f1cb4bdfc8768b8f0e123
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: ID inválido ou caso não encontrado
 *       500:
 *         description: Erro ao atualizar o caso
 */
router.put('/:id', authenticate, authorize(['admin', 'perito']), casesController.updateCase)

/**
 * @swagger
 * /api/casos/{id}:
 *   delete:
 *     summary: Deleta um caso pelo ID
 *     operationId: e_deleteCaseById
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
 *         description: Erro ao deletar o caso
 */
router.delete('/:id', authenticate, authorize(['admin', 'perito']), casesController.deleteCaseById)

/**
 * @swagger
 * /api/casos:
 *   delete:
 *     summary: Deleta todos os casos
 *     operationId: f_deleteAllCases
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Todos os casos foram deletados
 *       500:
 *         description: Erro ao deletar os casos
 */
router.delete('/', authenticate, authorize(['admin']), casesController.deleteCases)

module.exports = router
