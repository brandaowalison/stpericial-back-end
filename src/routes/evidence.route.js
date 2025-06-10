const express = require('express')
const evidenceController = require('../controllers/evidence.controller')
const { authenticate, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const router = express.Router()


/**
 * @swagger
 * tags:
 *   name: Evidências
 *   description: API para gerenciamento de evidências
 */

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
 *           enum: [imagem, video, documento, text]
 *           description: Tipo da evidência
 *         text:
 *           type: string
 *           description: Texto da evidência
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
 *         latitude:
 *           type: number
 *           description: Latitude da evidência
 *         longitude:
 *           type: number
 *           description: Longitude da evidência
 */

/**
 * @swagger
 * /api/evidences:
 *   post:
 *     summary: Cria uma nova evidência
 *     tags: [Evidências]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:  # Mudei para multipart/form-data para aceitar upload de arquivos
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               text:
 *                 type: string
 *               collectionDate:
 *                 type: string
 *                 format: date
 *               collectedBy:
 *                 type: string
 *               file:                # Aqui definimos o arquivo de forma explícita
 *                 type: string
 *                 format: binary      # Para arquivos binários (como imagens, vídeos)
 *               fileUrl:             # Ou a URL do arquivo, se for o caso
 *                 type: string
 *               case:
 *                 type: string
 *                 description: ID do caso associado à evidência
 * *               latitude:
 *                 type: number
 * *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Evidência adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 evidence:
 *                   $ref: '#/components/schemas/Evidence'
 *       400:
 *         description: Arquivo ou URL da evidência é obrigatório
 *       500:
 *         description: Erro ao adicionar evidência
 */
router.post('/', authenticate, authorize(['admin', 'perito', 'assistente']), upload.single('file'), evidenceController.createEvidence)

/**
 * @swagger
 * /api/evidences:
 *   get:
 *     summary: Lista todas as evidências
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
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), evidenceController.getEvidences)

/**
 * @swagger
 * /api/evidences/{id}:
 *   get:
 *     summary: Retorna uma evidência pelo ID
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
 *         description: Erro ao buscar evidência
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), evidenceController.getEvidenceById)

/**
 * @swagger
 * /api/evidences/{id}:
 *   put:
 *     summary: Atualiza uma evidência existente
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedEvidence:
 *                   $ref: '#/components/schemas/Evidence'
 *       400:
 *         description: ID inválido ou evidência não encontrada
 *       500:
 *         description: Erro ao atualizar evidência
 */
router.put('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), evidenceController.updateEvidence)

/**
 * @swagger
 * /api/evidences/{id}:
 *   delete:
 *     summary: Deleta uma evidência pelo ID
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
 *         description: Erro ao deletar evidência
 */
router.delete('/:id', authenticate, authorize(['admin']), evidenceController.deleteEvidenceById)

/**
 * @swagger
 * /api/evidences:
 *   delete:
 *     summary: Deleta todas as evidências
 *     tags: [Evidências]
 *     responses:
 *       200:
 *         description: Todas as evidências foram deletadas com sucesso
 *       500:
 *         description: Erro ao deletar todas as evidências
 */
router.delete('/', authenticate, authorize(['admin']), evidenceController.deleteEvidences)

module.exports = router
