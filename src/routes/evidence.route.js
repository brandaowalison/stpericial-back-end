const express = require('express')
const evidenceController = require('../controllers/evidence.controller')
const {authenticate, authorize} = require('../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Evidence:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID da evidência (gerado automaticamente)
 *         type:
 *           type: string
 *           enum: [imagem, video, documento]
 *           description: Tipo da evidência
 *         collectionDate:
 *           type: string
 *           format: date
 *           description: Data de coleta da evidência
 *         collectedBy:
 *           type: string
 *           description: ID do usuário responsável pela coleta da evidência
 *         fileUrl:
 *           type: string
 *           description: URL do arquivo da evidência
 *         case:
 *           type: string
 *           description: ID do caso relacionado a essa evidência
 */

/**
 * @swagger
 * /api/evidences:
 *   post:
 *     summary: Cria uma nova evidência
 *     operationId: createEvidence
 *     tags: [Evidências]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evidence'
 *     responses:
 *       201:
 *         description: Evidência criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evidence'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar a evidência
 */
router.post('/', authenticate, authorize(['admin','perito','assistente']), evidenceController.createEvidence)

/**
 * @swagger
 * /api/evidences:
 *   get:
 *     summary: Lista todas as evidências
 *     operationId: listEvidences
 *     tags: [Evidências]
 *     responses:
 *       200:
 *         description: Lista de evidências retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evidence'
 *       500:
 *         description: Erro ao listar as evidências
 */

router.get('/', authenticate, authorize(['admin','perito','assistente']), evidenceController.getEvidences)

/**
 * @swagger
 * /api/evidences/{id}:
 *   get:
 *     summary: Retorna uma evidência pelo ID
 *     operationId: getEvidenceById
 *     tags: [Evidências]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência
 *     responses:
 *       200:
 *         description: Evidência encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evidence'
 *       404:
 *         description: Evidência não encontrada
 *       500:
 *         description: Erro ao buscar a evidência
 */
router.get('/:id', authenticate, authorize(['admin','perito','assistente']), evidenceController.getEvidenceById)

/**
 * @swagger
 * /api/evidences/{id}:
 *   put:
 *     summary: Atualiza uma evidência existente
 *     operationId: updateEvidence
 *     tags: [Evidências]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evidence'
 *     responses:
 *       200:
 *         description: Evidência atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evidence'
 *       400:
 *         description: ID inválido ou evidência não encontrada
 *       500:
 *         description: Erro ao atualizar a evidência
 */
router.put('/:id', authenticate, authorize(['admin','perito','assistente']), evidenceController.updateEvidence)

/**
 * @swagger
 * /api/evidences/{id}:
 *   delete:
 *     summary: Deleta uma evidência pelo ID
 *     operationId: deleteEvidenceById
 *     tags: [Evidências]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da evidência a ser deletada
 *     responses:
 *       200:
 *         description: Evidência deletada com sucesso
 *       404:
 *         description: Evidência não encontrada
 *       500:
 *         description: Erro ao deletar a evidência
 */
router.delete('/:id', authenticate, authorize(['admin','perito','assistente']), evidenceController.deleteEvidenceById)

/**
 * @swagger
 * /api/evidences:
 *   delete:
 *     summary: Deleta todas as evidências
 *     operationId: deleteAllEvidences
 *     tags: [Evidências]
 *     responses:
 *       200:
 *         description: Todas as evidências foram deletadas com sucesso
 *       500:
 *         description: Erro ao deletar as evidências
 */
router.delete('/', authenticate, authorize(['admin']), evidenceController.deleteEvidences)

module.exports = router