const express = require('express')
const patientsController = require('../controllers/patient.controller')
const router = express.Router()
const {authenticate, authorize} = require('../middlewares/auth')

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do paciente (gerado automaticamente)
 *         name:
 *           type: string
 *           description: Nome do paciente
 *         sex:
 *           type: string
 *           enum: [masculino, feminino, outro]
 *           description: Sexo do paciente
 *         dateBirth:
 *           type: string
 *           format: date
 *           description: Data de nascimento do paciente
 *         identification:
 *           type: string
 *           description: Identificação única do paciente
 *         identified:
 *           type: boolean
 *           description: Indica se o paciente foi identificado
 *         observations:
 *           type: string
 *           description: Observações adicionais sobre o paciente
 */

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Cria um novo paciente
 *     operationId: createPatient
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Paciente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar o paciente
 */
router.post('/', authenticate, authorize(['admin','perito']), patientsController.createPatient)

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Lista todos os pacientes
 *     operationId: getPatients
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Erro ao listar os pacientes
 */
router.get('/', authenticate, authorize(['admin','perito',]), patientsController.getPatients)

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Retorna um paciente pelo ID
 *     operationId: getPatientById
 *     tags: [Pacientes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro ao buscar o paciente
 */
router.get('/:id', authenticate, authorize(['admin','perito','assistente']), patientsController.getPatientById)

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Atualiza um paciente existente
 *     operationId: updatePatient
 *     tags: [Pacientes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: ID inválido ou paciente não encontrado
 *       500:
 *         description: Erro ao atualizar o paciente
 */
router.put('/:id', authenticate, authorize(['admin','perito','assistente']), patientsController.updatePatient)

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Deleta um paciente pelo ID
 *     operationId: deletePatientById
 *     tags: [Pacientes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente a ser deletado
 *     responses:
 *       200:
 *         description: Paciente deletado com sucesso
 *       404:
 *         description: Paciente não encontrado
 *       500:
 *         description: Erro ao deletar o paciente
 */
router.delete('/:id', authenticate, authorize(['admin','perito']), patientsController.deletePatientById)

/**
 * @swagger
 * /api/patients:
 *   delete:
 *     summary: Deleta todos os pacientes
 *     operationId: deletePatients
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Todos os pacientes foram deletados com sucesso
 *       500:
 *         description: Erro ao deletar os pacientes
 */
router.delete('/', authenticate, authorize(['admin']), patientsController.deletePatients)

module.exports = router