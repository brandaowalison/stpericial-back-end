const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Por favor, insira um e-mail válido.']
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin','perito','assistente'],
        default: 'assistente'
    }
}, {timestamps: true})


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.generateTokenJWT = function() {
    const jwt = require('jsonwebtoken')
    return jwt.sign(
        {id: this._id, role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
    )
}

const User = mongoose.model('User', userSchema)
module.exports = User