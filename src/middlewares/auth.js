const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Token não fornecido'})
    }
    const token = authHeader.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        next()
    } catch (err) {
        return res.status(401).json({message: 'Token inválido'})
    }
}

function authorize(roles = []) {
    if(typeof roles === 'string') {
        roles = [roles]
    }
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({message: 'Acesso negado: permissão insuficiente'})
        }
        next()
    }
}



module.exports = {authenticate, authorize}