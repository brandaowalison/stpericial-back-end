const express = require('express')
const victimController = require('../controllers/victim.controller')
const { authenticate, authorize } = require('../middlewares/auth')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Vítimas
 *     description: API para gerenciamento de vítimas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Victim:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID da vítima (gerado automaticamente)
 *         name:
 *           type: string
 *           description: Nome da vítima
 *         sex:
 *           type: string
 *           enum: [masculino, feminino, outro]
 *           description: Sexo da vítima
 *         dateBirth:
 *           type: string
 *           format: date
 *           description: Data de nascimento da vítima
 *         identification:
 *           type: string
 *           description: Identificação única da vítima
 *         identified:
 *           type: boolean
 *           description: Indica se a vítima foi identificada
 *         observations:
 *           type: string
 *           description: Observações adicionais sobre a vítima
 *         ethnicity:
 *           type: string
 *           enum: ['branca', 'preta','parda','amarela','indigena','outro']
 *           description: Etnia da vítima
 *         age:
 *           type: integer
 *           description: Idade da vítima
 */

/**
 * @swagger
 * /api/victims:
 *   post:
 *     summary: Cria uma nova vítima
 *     tags: [Vítimas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Victim'
 *     responses:
 *       201:
 *         description: Vítima adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 victim:
 *                   $ref: '#/components/schemas/Victim'
 *       500:
 *         description: Erro ao adicionar vítima
 */
router.post('/', authenticate, authorize(['admin', 'perito']), victimController.createVictim)

/**
 * @swagger
 * /api/victims:
 *   get:
 *     summary: Lista todas as vítimas
 *     tags: [Vítimas]
 *     responses:
 *       200:
 *         description: Lista de vítimas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Victim'
 *       500:
 *         description: Erro ao listar as vítimas
 */
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), victimController.getVictims)

/**
 * @swagger
 * /api/victims/{id}:
 *   get:
 *     summary: Retorna uma vítima pelo ID
 *     tags: [Vítimas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da vítima
 *     responses:
 *       200:
 *         description: Vítima encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Victim'
 *       404:
 *         description: Vítima não encontrada
 *       500:
 *         description: Erro ao buscar vítima
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), victimController.getVictimById)

/**
 * @swagger
 * /api/victims/{id}:
 *   put:
 *     summary: Atualiza uma vítima existente
 *     tags: [Vítimas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da vítima a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Victim'
 *     responses:
 *       200:
 *         description: Vítima atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedVictim:
 *                   $ref: '#/components/schemas/Victim'
 *       400:
 *         description: ID inválido ou vítima não encontrada
 *       500:
 *         description: Erro ao atualizar vítima
 */
router.put('/:id', authenticate, authorize(['admin', 'perito']), victimController.updateVictim)

/**
 * @swagger
 * /api/victims/{id}:
 *   delete:
 *     summary: Deleta uma vítima pelo ID
 *     tags: [Vítimas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da vítima a ser deletada
 *     responses:
 *       200:
 *         description: Vítima deletada com sucesso
 *       404:
 *         description: Vítima não encontrada
 *       500:
 *         description: Erro ao deletar vítima
 */
router.delete('/:id', authenticate, authorize(['admin']), victimController.deleteVictimById)

/**
 * @swagger
 * /api/victims:
 *   delete:
 *     summary: Deleta todas as vítimas
 *     tags: [Vítimas]
 *     responses:
 *       200:
 *         description: Todas as vítimas foram deletadas com sucesso
 *       500:
 *         description: Erro ao deletar todas as vítimas
 */
router.delete('/', authenticate, authorize(['admin']), victimController.deleteVictims)

module.exports = router
