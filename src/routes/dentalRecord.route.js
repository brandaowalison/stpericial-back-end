const express = require('express')
const dentalsRecordsController = require('../controllers/dentalRecord.controller')
const router = express.Router()
const {authenticate, authorize} = require('../middlewares/auth')

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
 *         xRayImage:
 *           type: string
 *           description: URL da imagem de raio-x
 *         notes:
 *           type: string
 *           description: Notas sobre o registro odontológico
 *         patient:
 *           type: string
 *           description: ID do paciente associado ao registro odontológico
 */

/**
 * @swagger
 * /api/dental-records:
 *   post:
 *     summary: Cria um novo registro odontológico
 *     operationId: createDentalRecord
 *     tags: [Registros Odontológicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DentalRecord'
 *     responses:
 *       201:
 *         description: Registro odontológico criado com sucesso
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
 *         description: Erro ao criar o registro odontológico
 */
router.post('/', authenticate, authorize(['admin','perito']), dentalsRecordsController.createDentalRecord)

/**
 * @swagger
 * /api/dental-records:
 *   get:
 *     summary: Lista todos os registros odontológicos
 *     operationId: getDentalRecords
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
router.get('/', authenticate, authorize(['admin','perito','assistente']), dentalsRecordsController.getDentalRecords)

/**
 * @swagger
 * /api/dental-records/{id}:
 *   get:
 *     summary: Retorna um registro odontológico pelo ID
 *     operationId: getDentalRecordById
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
 *         description: Erro ao buscar o registro odontológico
 */
router.get('/:id', authenticate, authorize(['admin','perito','assistente']), dentalsRecordsController.getDentalRecordById)

/**
 * @swagger
 * /api/dental-records/{id}:
 *   put:
 *     summary: Atualiza um registro odontológico existente
 *     operationId: updateDentalRecord
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
 *         description: Erro ao atualizar o registro odontológico
 */
router.put('/:id', authenticate, authorize(['admin','perito']), dentalsRecordsController.updateDentalRecord)

/**
 * @swagger
 * /api/dental-records/{id}:
 *   delete:
 *     summary: Deleta um registro odontológico pelo ID
 *     operationId: deleteDentalRecordById
 *     tags: [Registros Odontológicos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro odontológico a ser deletado
 *     responses:
 *       200:
 *         description: Registro odontológico deletado com sucesso
 *       404:
 *         description: Registro odontológico não encontrado
 *       500:
 *         description: Erro ao deletar o registro odontológico
 */
router.delete('/:id', authenticate, authorize(['admin']), dentalsRecordsController.deleteDentalRecordById)

/**
 * @swagger
 * /api/dental-records:
 *   delete:
 *     summary: Deleta todos os registros odontológicos
 *     operationId: deleteDentalRecords
 *     tags: [Registros Odontológicos]
 *     responses:
 *       200:
 *         description: Todos os registros odontológicos foram deletados com sucesso
 *       500:
 *         description: Erro ao deletar os registros odontológicos
 */
router.delete('/', authenticate, authorize(['admin','perito']), dentalsRecordsController.createDentalRecord )

module.exports = router
