const fs = require('fs')
const crypto = require('crypto')

const privateKey = fs.readFileSync('./private.pem','utf8')
const publicKey = fs.readFileSync('./public.pem','utf8')

function assinarLaudo(texto) {
    const sign = crypto.createSign('SHA256')
    sign.update(texto)
    sign.end()
    const assinatura = sing(privateKey, 'base64')
    return assinatura
}

function verificarAssinatura(texto, assinatura) {
    const verify = crypto.createVerify('SHA256')
    verify.update(texto)
    verify.end()
    return verify.verify(publicKey, assinatura, 'base64')
}

module.exports = {assinarLaudo, verificarAssinatura}