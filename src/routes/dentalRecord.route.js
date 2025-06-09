const express = require('express')
const dentalsRecordsController = require('../controllers/dentalRecord.controller')
const router = express.Router()
const { authenticate, authorize } = require('../middlewares/auth')

/**
 * @swagger
 * tags:
 *   name: Registros Odontológicos
 *   description: API para gerenciamento de registros odontológicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DentalRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do registro odontológico (gerado automaticamente)
 *         missingTeeth:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de dentes ausentes
 *         dentalMarks:
 *           type: array
 *           items:
 *             type: string
 *           description: Marcas dentárias
 *         notes:
 *           type: string
 *           description: Notas sobre o registro odontológico
 *         victim:
 *           type: string
 *           description: ID da vítima associada ao registro odontológico
 */

/**
 * @swagger
 * /api/dentalRecord:
 *   post:
 *     summary: Cria um novo registro odontológico
 *     tags: [Registros Odontológicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DentalRecord'
 *     responses:
 *       201:
 *         description: Registro odontológico adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 dentalRecord:
 *                   $ref: '#/components/schemas/DentalRecord'
 *       500:
 *         description: Erro ao adicionar registro odontológico
 */
router.post('/', authenticate, authorize(['admin', 'perito']), dentalsRecordsController.createDentalRecord)

/**
 * @swagger
 * /api/dentalRecord:
 *   get:
 *     summary: Lista todos os registros odontológicos
 *     tags: [Registros Odontológicos]
 *     responses:
 *       200:
 *         description: Lista de registros odontológicos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DentalRecord'
 *       500:
 *         description: Erro ao listar os registros odontológicos
 */
router.get('/', authenticate, authorize(['admin', 'perito', 'assistente']), dentalsRecordsController.getDentalRecords)

/**
 * @swagger
 * /api/dentalRecord/{id}:
 *   get:
 *     summary: Retorna um registro odontológico pelo ID
 *     tags: [Registros Odontológicos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro odontológico
 *     responses:
 *       200:
 *         description: Registro odontológico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DentalRecord'
 *       404:
 *         description: Registro odontológico não encontrado
 *       500:
 *         description: Erro ao buscar registro odontológico
 */
router.get('/:id', authenticate, authorize(['admin', 'perito', 'assistente']), dentalsRecordsController.getDentalRecordById)

/**
 * @swagger
 * /api/dentalRecord/{id}:
 *   put:
 *     summary: Atualiza um registro odontológico existente
 *     tags: [Registros Odontológicos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro odontológico a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DentalRecord'
 *     responses:
 *       200:
 *         description: Registro odontológico atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedDentalRecord:
 *                   $ref: '#/components/schemas/DentalRecord'
 *       400:
 *         description: ID inválido ou registro odontológico não encontrado
 *       500:
 *         description: Erro ao atualizar registro odontológico
 */
router.put('/:id', authenticate, authorize(['admin', 'perito']), dentalsRecordsController.updateDentalRecord)

/**
 * @swagger
 * /api/dentalRecord/{id}:
 *   delete:
 *     summary: Remove um registro odontológico
 *     tags: [Registros Odontológicos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro odontológico a ser removido
 *     responses:
 *       200:
 *         description: Registro odontológico removido com sucesso
 *       404:
 *         description: Registro odontológico não encontrado
 *       500:
 *         description: Erro ao remover registro odontológico
 */
router.delete('/:id', authenticate, authorize(['admin', 'perito']), dentalsRecordsController.deleteDentalRecordById)

/**
 * @swagger
 * /api/dentalRecord:
 *   delete:
 *     summary: Remove todos os registros odontológicos
 *     tags: [Registros Odontológicos]
 *     responses:
 *       200:
 *         description: Todos os registros odontológicos foram removidos com sucesso
 *       500:
 *         description: Erro ao remover registros odontológicos
 */
router.delete('/', authenticate, authorize(['admin']), dentalsRecordsController.deleteDentalsRecords)

module.exports = router
