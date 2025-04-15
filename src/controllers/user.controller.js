const User = require('../models/user')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')



const createUser = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        })
        await user.save()
        res.status(201).json({message: 'Usuário cadastrado com sucesso!', user: user})
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err)
        res.status(500).json({error: 'Erro ao cadastrar usuário.', details: err.message})
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (err) {
        console.error('Erro ao listar usuários:', err)
        res.status(500).json({error: 'Erro ao listar usuários.'})
    }
}

const getUserById = async (req, res) => {
    const {id} = req.params
    if (!id || id.trim() === '') {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`})
    }

    try {
        const user = await User.findById(id).select('-password')
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({message: `Usuário não encontrado com essa id=${id}.`})
        }
    } catch (err) {
        console.error('Erro ao encontrar usuário:', err)
        res.status(500).json({error: 'Erro ao encontrar usuário.'})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user)
            return res.status(400).json({message: 'Usuário não encontrado'})
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.status(400).json({message: 'Senha incorreta'})
        const token = user.generateTokenJWT()
        res.status(200).json({
            message: 'Login bem-sucedido',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (err) {
        console.error('Erro ao realizar login:', err)
        res.status(500).json({error: 'Erro ao realizar login'})
    }
}

const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body

        if (role && !['perito', 'assistente'].includes(role)) {
            return res.status(400).json({ message: 'Função inválida!' });
        }

        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({message: 'Email já cadastrado.'})
        }
        const user = new User({
            name,
            email,
            password,
            role: role || 'assistente'
        })
        await user.save()

        const token = user.generateTokenJWT()
        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (err) {
        console.error('Erro no registro de usuário:', err);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
}

const logout = (req, res) => {
    res.status(200).json({message: 'Logout bem-sucedido'})
}

const updateUser = async (req, res) => {
    const {id} = req.params
    if(req.body.password && req.body.password.trim() !=='') {
        req.body.password = await bcrypt.hash(req.body.password, 10)
    } else {
        delete req.body.password
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        if(!updatedUser) {
            return res.status(404).json({message: `Usuário não encontrado com essa id=${id}.`})
        }
        const userResponse = updatedUser.toObject()
        delete userResponse.password
        res.status(200).json({message: 'Usuário atualizado com sucesso!', updatedUser: userResponse})
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err)
        res.status(500).json({error: 'Erro ao atualizar usuário.'})
    }
}

const deleteUserById = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'ID inválido'})
    }
    
    try {
        const deletedUser = await User.deleteOne({_id: id})
        if(deletedUser.deletedCount === 0) {
          return  res.status(404).json({message: `Nenhum usuário encontrado com essa id=${id}.`})
        }

        res.status(200).json({message: `Usuário com ID=${id} foi deletado com sucesso!`})
    } catch (err) {
        console.error('Erro ao deletar usuário:', err)
        res.status(500).json({error: 'Erro ao deletar usuário.'})
    }
}

const deleteUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Somente administradores podem deletar todos os usuários.' })
        }
        const deletedUsers = await User.deleteMany()
        res.status(200).json({message: 'Todos os usuários foram deletados com sucesso!', 
        deletedCount: deletedUsers.deletedCount})
    } catch (err) {
        console.error('Erro ao deletar todos os usuários:', err)
        res.status(500).json({error: 'Erro ao deletar todos os usuários.'})
    }
}


module.exports = {
    createUser, 
    getUsers, 
    getUserById, 
    login,
    register,
    logout, 
    updateUser, 
    deleteUserById, 
    deleteUsers
}