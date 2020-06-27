'use strict';

const user = require('../model/user');
const userSetting = require('../model/userSetting')
const Service = require('egg').Service;
const crypto = require('crypto');
const fs = require('fs')

class UserService extends Service {
  async findUser(email){
    const result = await this.ctx.model.User.find({"email":email});
    return result
  }
  async addUser(email,username,password,role) {    
    const res = await this.findUser(email)
    const that = this
    if(res.length === 0){      
      const encode = this.encryption(password).then(
        function(res){
          const user = new that.ctx.model.User({
            email:email,
            username:username,
            password:res,
            role:role
          })
          user.save()
          const userSetting = new that.ctx.model.UserSetting({
            email:email,
            avatar: 'default',
            details:'default details'
          })
          userSetting.save()          
        }        
      ).catch()
      return true 
    }
    else{
      return false    
    }
  }
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

module.exports = UserService;