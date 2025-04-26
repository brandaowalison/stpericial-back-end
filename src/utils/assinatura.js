const fs = require('fs')
const crypto = require('crypto')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

const privateKeyPath = isProduction ? '/etc/secrets/private.pem' : process.env.PRIVATE_KEY_PATH
const publicKeyPath = isProduction ? '/etc/secrets/public.pem' : process.env.PUBLIC_KEY_PATH

let privateKey, publicKey

try {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8')
    publicKey = fs.readFileSync(publicKeyPath, 'utf8')
} catch (err) {
    console.error('Erro ao carregar as chaves:', err.message)
    process.exit(1)
}

function assinarLaudo(texto) {
    const sign = crypto.createSign('SHA256')
    sign.update(texto)
    sign.end()
    return sign.sign(privateKey, 'base64')
}

function verificarAssinatura(texto, assinatura) {
    const verify = crypto.createVerify('SHA256')
    verify.update(texto)
    verify.end()
    return verify.verify(publicKey, assinatura, 'base64')
}

module.exports = { assinarLaudo, verificarAssinatura }
