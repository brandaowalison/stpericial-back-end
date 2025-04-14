const express = require('express')
const userController = require('../controllers/user.controller')
const {authenticate, authorize} = require('../middlewares/auth')

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID do usuário (gerado automaticamente)
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: E-mail do usuário
 *         role:
 *           type: string
 *           description: Função do usuário (admin, perito, assistente)
 *         password:
 *           type: string
 *           description: Senha do usuário (não será retornada)
 *         token:
 *           type: string
 *           description: Token JWT gerado para autenticação
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     operationId: createUser
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro ao criar usuário
 */
router.post('/', authenticate, authorize(['admin']), userController.createUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     operationId: loginUser
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado
 *       400:
 *         description: E-mail ou senha incorretos
 *       500:
 *         description: Erro ao realizar login
 */
router.post('/login', userController.login)

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     operationId: registerUser
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *               role:
 *                 type: string
 *                 description: Função do usuário (admin, perito, assistente)
 *                 default: assistente
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado
 *       400:
 *         description: E-mail já cadastrado ou função inválida
 *       500:
 *         description: Erro ao registrar o usuário
 */
router.post('/register', userController.register)

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Realiza o logout de um usuário
 *     operationId: logoutUser
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: O usuário não está autenticado
 *       500:
 *         description: Erro ao realizar o logout
 */
router.post('/logout', authenticate, authorize(['admin','perito','assistente']), userController.logout)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários
 *     operationId: getUsers
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro ao listar usuários
 */
router.get('/', authenticate, authorize(['admin']), userController.getUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     operationId: getUserById
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar o usuário
 */
router.get('/:id', authenticate, authorize(['admin']), userController.getUserById)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     operationId: updateUser
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedUser:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ID inválido ou dados do usuário incorretos
 *       500:
 *         description: Erro ao atualizar o usuário
 */
router.put('/:id', authenticate, authorize(['admin']), userController.updateUser)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     operationId: deleteUserById
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao deletar o usuário
 */
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUserById)

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Deleta todos os usuários
 *     operationId: deleteUsers
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Todos os usuários foram deletados com sucesso
 *       500:
 *         description: Erro ao deletar todos os usuários
 */
router.delete('/', authenticate, authorize(['admin']), userController.deleteUsers)

module.exports = router