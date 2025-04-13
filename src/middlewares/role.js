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

module.exports = {authorize}