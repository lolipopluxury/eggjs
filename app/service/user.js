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
          const save = user.save()
          return save
        }        
      ).catch()  
    }else{
      return false    
    }
  }
  async encryption(decryptedCode) {
    const salt = this.app.config.salt
    const hashSecret = this.app.config.hashSecret
    const encode = crypto.createHmac('sha256',hashSecret).update(`${salt}${decryptedCode}`).digest('hex')  
    return encode
  }
}

module.exports = UserService;