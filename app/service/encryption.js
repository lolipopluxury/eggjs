'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
const fs = require('fs')

class EncryptionService extends Service {
  async encryption(decryptedCode) {
    const publicKey = fs.readFileSync('./rsa_public_key.pem').toString('ascii')
    const encode = crypto.publicEncrypt(publicKey, Buffer.from(decryptedCode)).toString('base64');
    return encode
  }
  async decryption(encryptedCode) {
    const privateKey = fs.readFileSync('./rsa_private_key.pem').toString('ascii') 
    const decode = crypto.privateDecrypt(privateKey, Buffer.from(encryptedCode.toString('base64'), 'base64')).toString();
    return decode
  }
}

module.exports = EncryptionService;