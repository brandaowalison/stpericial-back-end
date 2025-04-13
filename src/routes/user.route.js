const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router()

router.post('/', userController.createUser)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/logout', userController.logout)
router.get('/', userController.getUsers)
router.get('/:id', userController.getUserById)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUserById)
router.delete('/', userController.deleteUsers)

module.exports = router