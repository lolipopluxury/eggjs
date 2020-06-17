'use strict';

const user = require('../model/user');
const Service = require('egg').Service;
const crypto = require('crypto');

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
        }        
      ).catch()
      return true 
    }
    else{
      return false    
    }
  }
  async encryption(decryptedCode) {
    const salt = this.app.config.salt
    const hashSecret = this.app.config.hashSecret
    const preEncode = crypto.createHmac('sha256',hashSecret).update(decryptedCode).digest('hex')  
    const encode = crypto.createHmac('sha512',hashSecret).update(`${salt}${preEncode}`).digest('hex')  
    return encode
  }
}

module.exports = UserService;